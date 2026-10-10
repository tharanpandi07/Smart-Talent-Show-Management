package com.dmgr.talent.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Talent categories shown on the "Select Talent Category" screen.
 * Corrected categories:
 *  🎭 Arts & Culture
 *  💻 Technical / IT
 *  🏅 Sports & Fitness
 *  🎤 Communication
 *  🧠 Creative
 */
@Entity
@Table(name = "talent_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TalentCategory {

    @Id
    private String id;

    private String name;

    private String emoji;

    @Column(name = "event_count")
    private Integer eventCount;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Talent> talents;
}
