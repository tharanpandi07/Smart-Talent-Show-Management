package com.dmgr.talent.controller;

import com.dmgr.talent.dto.SelectionDtos.CategoryDto;
import com.dmgr.talent.model.TalentCategory;
import com.dmgr.talent.repository.TalentCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Screen 3: Talent Category
 *
 * Categories (corrected):
 *  🎭 Arts & Culture
 *  💻 Technical / IT
 *  🏅 Sports & Fitness
 *  🎤 Communication
 *  🧠 Creative
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final TalentCategoryRepository categoryRepository;

    @GetMapping
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    private CategoryDto toDto(TalentCategory c) {
        return new CategoryDto(c.getId(), c.getName(), c.getEmoji(), c.getEventCount());
    }
}
