package com.dmgr.talent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
// Prevent Lombok @Data from generating toString/hashCode that traverse lazy relations → StackOverflow
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "register_number", unique = true, nullable = false)
    private String registerNumber;

    @Column(name = "mobile_number", nullable = false)
    private String mobileNumber;

    private String name;

    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    private String year;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_talent_id")
    private Talent selectedTalent;

    // Use LAZY + break the bidirectional cycle: Team -> members -> Student -> team -> members ...
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Override equals/hashCode manually to avoid Lombok traversing lazy collections
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Student other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Student{id=" + id + ", registerNumber='" + registerNumber + "'}";
    }
}
