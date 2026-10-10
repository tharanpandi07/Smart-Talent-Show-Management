package com.dmgr.talent.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A single talent option under a category, e.g.
 * "Coding (Java, Python, etc.)" under "Technical / IT".
 */
@Entity
@Table(name = "talents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Talent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private TalentCategory category;

    private String name;

    /** lucide-react icon key used by the frontend */
    private String icon;
}
