package com.dmgr.talent.repository;

import com.dmgr.talent.model.TalentCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TalentCategoryRepository extends JpaRepository<TalentCategory, String> {
}
