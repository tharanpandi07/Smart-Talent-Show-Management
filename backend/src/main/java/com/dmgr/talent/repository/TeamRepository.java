package com.dmgr.talent.repository;

import com.dmgr.talent.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByTalent_Id(Long talentId);

    Optional<Team> findFirstByTalent_IdAndDepartment_Id(Long talentId, String departmentId);
}
