package com.dmgr.talent.controller;

import com.dmgr.talent.dto.AuthDtos.LoginRequest;
import com.dmgr.talent.dto.AuthDtos.LoginResponse;
import com.dmgr.talent.model.Student;
import com.dmgr.talent.repository.StudentRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Screen 1: Login
 * FIX: Type inference error — lambda return type was ambiguous between
 *      LoginResponse and ErrorBody. Replaced .map(lambda).orElseGet(lambda)
 *      with explicit if/else block to avoid Java generic inference failure.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final StudentRepository studentRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        var studentOpt = studentRepository
                .findByRegisterNumberAndMobileNumber(
                        request.getRegisterNumber(),
                        request.getMobileNumber()
                );

        if (studentOpt.isPresent()) {
            return ResponseEntity.ok(toResponse(studentOpt.get()));
        } else {
            return ResponseEntity.status(401)
                    .body(new ErrorBody("Invalid Register Number or Mobile Number. Please contact your coordinator."));
        }
    }

    private LoginResponse toResponse(Student s) {
        return new LoginResponse(
                s.getId(),
                s.getName(),
                s.getRegisterNumber(),
                s.getDepartment() != null ? s.getDepartment().getId() : null,
                s.getDepartment() != null ? s.getDepartment().getName() : null,
                s.getDepartment() != null,
                s.getSelectedTalent() != null
        );
    }

    record ErrorBody(String message) {}
}