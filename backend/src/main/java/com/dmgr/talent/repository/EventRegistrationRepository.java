package com.dmgr.talent.repository;

import com.dmgr.talent.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {

    Optional<EventRegistration> findByEvent_IdAndStudent_Id(Long eventId, Long studentId);

    // FIX: added countByStudent_Id (was missing - ProfileController needs it)
    long countByStudent_Id(Long studentId);

    long countByEvent_Id(Long eventId);
}
