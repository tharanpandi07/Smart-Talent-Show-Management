package com.dmgr.talent.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank
        private String registerNumber;

        @NotBlank
        private String mobileNumber;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private Long studentId;
        private String name;
        private String registerNumber;
        private String departmentId;
        private String departmentName;
        private boolean departmentSelected;
        private boolean talentSelected;
    }
}
