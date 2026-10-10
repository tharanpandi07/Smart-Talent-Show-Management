package com.dmgr.talent.repository;

import com.dmgr.talent.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByDepartment_IdOrderByEventDateAsc(String departmentId);

    List<Event> findAllByOrderByEventDateAsc();
}
