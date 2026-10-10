package com.dmgr.talent.repository;

import com.dmgr.talent.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, String> {
}
