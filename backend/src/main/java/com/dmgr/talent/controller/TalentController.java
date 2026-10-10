package com.dmgr.talent.controller;

import com.dmgr.talent.dto.SelectionDtos.TalentDto;
import com.dmgr.talent.dto.SelectionDtos.TalentSelectionRequest;
import com.dmgr.talent.model.Student;
import com.dmgr.talent.model.Talent;
import com.dmgr.talent.model.Team;
import com.dmgr.talent.repository.StudentRepository;
import com.dmgr.talent.repository.TalentRepository;
import com.dmgr.talent.repository.TeamRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Screen 4: Choose Your Talent
 * AUTO TEAM ASSIGN: When a student selects a talent,
 * the system automatically finds an existing team for that
 * talent+department OR creates a new one.
 */
@RestController
@RequestMapping("/api/talents")
@RequiredArgsConstructor
public class TalentController {

    private final TalentRepository talentRepository;
    private final StudentRepository studentRepository;
    private final TeamRepository teamRepository;

    // GET /api/talents?categoryId=technical
    @GetMapping
    public List<TalentDto> getTalentsByCategory(@RequestParam String categoryId) {
        return talentRepository.findByCategory_Id(categoryId).stream()
                .map(this::toDto)
                .toList();
    }

    // POST /api/talents/select/{studentId}
    @PostMapping("/select/{studentId}")
    public ResponseEntity<?> selectTalent(
            @PathVariable Long studentId,
            @Valid @RequestBody TalentSelectionRequest request
    ) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) {
            return ResponseEntity.status(404).body(new ErrorBody("Student not found."));
        }

        Talent talent = talentRepository.findById(request.getTalentId()).orElse(null);
        if (talent == null) {
            return ResponseEntity.status(404).body(new ErrorBody("Talent not found."));
        }

        // Save selected talent
        student.setSelectedTalent(talent);

        // -------------------------------------------------------
        // AUTO TEAM ASSIGN
        // 1. Find existing team for this talent + department
        // 2. If found → assign student to it
        // 3. If not found → create a new team, make student leader
        // -------------------------------------------------------
        String departmentId = student.getDepartment() != null
                ? student.getDepartment().getId()
                : null;

        Optional<Team> existingTeam = teamRepository
                .findFirstByTalent_IdAndDepartment_Id(talent.getId(), departmentId);

        if (existingTeam.isPresent()) {
            // Join existing team
            student.setTeam(existingTeam.get());
        } else {
            // Create new team
            Team newTeam = new Team();
            newTeam.setTalent(talent);
            newTeam.setDepartment(student.getDepartment());

            // Team name = DeptID + TalentName short + "Team"
            // e.g. "IT Coding Team"
            String shortTalent = talent.getName().split("\\(")[0].trim(); // "Coding"
            String deptUpper   = departmentId != null ? departmentId.toUpperCase() : "GEN";
            newTeam.setName(deptUpper + " " + shortTalent + " Team");

            // Save team first to get ID
            newTeam = teamRepository.save(newTeam);

            // Make this student the team leader
            newTeam.setLeaderId(student.getId());
            newTeam = teamRepository.save(newTeam);

            student.setTeam(newTeam);
        }

        studentRepository.save(student);

        return ResponseEntity.ok(toDto(talent));
    }

    private TalentDto toDto(Talent t) {
        return new TalentDto(
                t.getId(),
                t.getName(),
                t.getIcon(),
                t.getCategory().getId()
        );
    }

    record ErrorBody(String message) {}
}