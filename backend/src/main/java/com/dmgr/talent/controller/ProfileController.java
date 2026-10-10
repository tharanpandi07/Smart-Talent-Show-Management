package com.dmgr.talent.controller;

import com.dmgr.talent.dto.ProfileDto;
import com.dmgr.talent.model.Student;
import com.dmgr.talent.repository.EventRegistrationRepository;
import com.dmgr.talent.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Screen 8: My Profile
 * FIX: replaced findAll().stream().filter() with a proper count query
 *      to avoid loading all registrations into memory.
 */
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final StudentRepository studentRepository;
    private final EventRegistrationRepository registrationRepository;

    @GetMapping("/{studentId}")
    public ResponseEntity<?> getProfile(@PathVariable Long studentId) {
        Student s = studentRepository.findById(studentId)
                .orElse(null);

        if (s == null) {
            return ResponseEntity.status(404).body(new ErrorBody("Student not found."));
        }

        // FIX: use the dedicated count query instead of findAll()
        long eventsParticipated = registrationRepository.countByStudent_Id(studentId);

        ProfileDto dto = new ProfileDto(
                s.getId(),
                s.getName(),
                s.getRegisterNumber(),
                s.getDepartment() != null ? s.getDepartment().getName() : null,
                s.getYear(),
                s.getEmail(),
                s.getMobileNumber(),
                s.getSelectedTalent() != null ? s.getSelectedTalent().getName() : null,
                s.getTeam() != null ? s.getTeam().getName() : null,
                s.getTeam() != null && s.getId().equals(s.getTeam().getLeaderId()),
                (int) eventsParticipated,
                0,
                0
        );

        return ResponseEntity.ok(dto);
    }

    record ErrorBody(String message) {}
}
