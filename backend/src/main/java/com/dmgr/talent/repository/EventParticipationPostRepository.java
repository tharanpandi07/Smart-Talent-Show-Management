package com.dmgr.talent.repository;

import com.dmgr.talent.model.EventParticipationPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventParticipationPostRepository extends JpaRepository<EventParticipationPost, Long> {
    List<EventParticipationPost> findAllByOrderByCreatedAtDesc();
}