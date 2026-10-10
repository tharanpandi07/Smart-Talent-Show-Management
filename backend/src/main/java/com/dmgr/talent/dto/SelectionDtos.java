package com.dmgr.talent.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class SelectionDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentSelectionRequest {
        @NotBlank
        private String departmentId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TalentSelectionRequest {
        @NotNull
        private Long talentId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TalentDto {
        private Long id;
        private String name;
        private String icon;
        private String categoryId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDto {
        private String id;
        private String name;
        private String emoji;
        private Integer eventCount;
    }
}
