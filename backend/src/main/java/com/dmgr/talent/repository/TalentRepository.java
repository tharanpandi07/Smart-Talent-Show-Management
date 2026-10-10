package com.dmgr.talent.repository;

import com.dmgr.talent.model.Talent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TalentRepository extends JpaRepository<Talent, Long> {

    List<Talent> findByCategory_Id(String categoryId);
}
