package com.dmgr.talent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    private Long id;
    private String name;
    private String registerNumber;
    private String departmentName;
    private String year;
    private String email;
    private String mobileNumber;
    private String talentName;
    private String teamName;
    private boolean teamLeader;

    // My Activity stats
    private int eventsParticipated;
    private int certificatesEarned;
    private int achievements;
}
