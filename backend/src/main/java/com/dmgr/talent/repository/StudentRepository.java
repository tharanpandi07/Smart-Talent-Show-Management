package com.dmgr.talent.repository;

import com.dmgr.talent.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRegisterNumberAndMobileNumber(String registerNumber, String mobileNumber);

    Optional<Student> findByRegisterNumber(String registerNumber);

    // FIX: Added for TeamController - avoids LazyInitializationException on team.getMembers()
    List<Student> findByTeam_Id(Long teamId);
}
