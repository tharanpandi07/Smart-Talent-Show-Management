package com.dmgr.talent.controller;

import com.dmgr.talent.dto.SelectionDtos.DepartmentSelectionRequest;
import com.dmgr.talent.model.Department;
import com.dmgr.talent.model.Student;
import com.dmgr.talent.repository.DepartmentRepository;
import com.dmgr.talent.repository.StudentRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Screen 2: Department Selection
 * Department can only be set ONCE per student ("You can't change it later").
 */
@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository departmentRepository;
    private final StudentRepository studentRepository;

    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @PostMapping("/select/{studentId}")
    public ResponseEntity<?> selectDepartment(
            @PathVariable Long studentId,
            @Valid @RequestBody DepartmentSelectionRequest request
    ) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getDepartment() != null) {
            return ResponseEntity.status(409).body(
                    new ErrorBody("Department already set and cannot be changed.")
            );
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        student.setDepartment(department);
        studentRepository.save(student);

        return ResponseEntity.ok(department);
    }

    record ErrorBody(String message) {}
}
