package com.dmgr.talent.controller;

import com.dmgr.talent.dto.TeamDtos.TeamDto;
import com.dmgr.talent.dto.TeamDtos.TeamMemberDto;
import com.dmgr.talent.model.Student;
import com.dmgr.talent.model.Team;
import com.dmgr.talent.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Screen 5: My Team
 * FIX: removed unused TeamRepository injection (caused unused-bean warning).
 * FIX: null-safe department access in member year string.
 * FIX: Hibernate lazy collection accessed inside transaction — team.getMembers()
 *      was called outside a session; fixed by using studentRepository.findByTeam_Id().
 */
@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final StudentRepository studentRepository;

    @GetMapping("/my/{studentId}")
    public ResponseEntity<?> getMyTeam(@PathVariable Long studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) {
            return ResponseEntity.status(404).body(new ErrorBody("Student not found."));
        }

        Team team = student.getTeam();
        if (team == null) {
            return ResponseEntity.status(404).body(new ErrorBody("You have not been assigned to a team yet."));
        }

        // FIX: load members via repository (avoids LazyInitializationException)
        List<Student> members = studentRepository.findByTeam_Id(team.getId());

        String leaderName = members.stream()
                .filter(m -> m.getId().equals(team.getLeaderId()))
                .map(Student::getName)
                .findFirst()
                .orElse("Unassigned");

        List<TeamMemberDto> memberDtos = members.stream()
                .map(m -> new TeamMemberDto(
                        m.getId(),
                        m.getName() + (m.getId().equals(studentId) ? " (You)" : ""),
                        // FIX: null-safe department check
                        (m.getDepartment() != null ? m.getDepartment().getId().toUpperCase() : "?") + " - " + m.getYear(),
                        m.getId().equals(team.getLeaderId()) ? "Team Leader" : "Member",
                        m.getId().equals(studentId)
                ))
                .toList();

        TeamDto dto = new TeamDto(
                team.getId(),
                team.getName(),
                team.getTalent() != null ? team.getTalent().getName() : null,
                team.getTalent() != null ? team.getTalent().getIcon() : null,
                leaderName,
                members.size(),
                team.getDepartment() != null ? team.getDepartment().getName() : null,
                memberDtos
        );

        return ResponseEntity.ok(dto);
    }

    record ErrorBody(String message) {}
}
