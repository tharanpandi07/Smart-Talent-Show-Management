package com.dmgr.talent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class TeamDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeamMemberDto {
        private Long id;
        private String name;
        private String year;
        private String role;
        private boolean you;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeamDto {
        private Long id;
        // FIX: was only "talentName" but TeamController now sets team.getName() as name
        //      and talent name separately — added both fields
        private String name;        // Team name e.g. "Team Alpha"
        private String talentName;  // e.g. "Coding (Java, Python, etc.)"
        private String talentIcon;
        private String leaderName;
        private int totalMembers;
        private String departmentName;
        private List<TeamMemberDto> members;
    }
}
