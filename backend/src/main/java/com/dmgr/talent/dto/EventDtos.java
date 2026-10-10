package com.dmgr.talent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class EventDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventSummaryDto {
        private Long id;
        private String title;
        private String subtitle;
        private LocalDate eventDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private List<String> tags;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventDetailDto {
        private Long id;
        private String title;
        private String subtitle;
        private LocalDate eventDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private String venue;
        private String eligibility;
        private String description;
        private String teamSize;
        private LocalDateTime registrationDeadline;
        private List<String> tags;
        private boolean registered;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private Long studentId;
    }
}
