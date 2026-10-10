package com.dmgr.talent.controller;

import com.dmgr.talent.dto.EventDtos.*;
import com.dmgr.talent.model.Event;
import com.dmgr.talent.model.EventRegistration;
import com.dmgr.talent.model.Student;
import com.dmgr.talent.repository.EventRegistrationRepository;
import com.dmgr.talent.repository.EventRepository;
import com.dmgr.talent.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Screen 6: Upcoming Events
 * Screen 7: Event Details (+ Register Now)
 *
 * FIX: Registration deadline eligibility check added.
 * FIX: Department check on registration (only student's own dept).
 * FIX: event.getTags() null-safe — tags list built from nullable relations.
 */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final EventRegistrationRepository registrationRepository;

    @GetMapping
    public List<EventSummaryDto> getUpcomingEvents(@RequestParam(required = false) String departmentId) {
        List<Event> events = (departmentId != null)
                ? eventRepository.findByDepartment_IdOrderByEventDateAsc(departmentId)
                : eventRepository.findAllByOrderByEventDateAsc();
        return events.stream().map(this::toSummary).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventDetails(
            @PathVariable Long id,
            @RequestParam(required = false) Long studentId
    ) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event == null) {
            return ResponseEntity.status(404).body(new ErrorBody("Event not found."));
        }

        boolean registered = studentId != null &&
                registrationRepository.findByEvent_IdAndStudent_Id(id, studentId).isPresent();

        return ResponseEntity.ok(toDetail(event, registered));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<?> register(
            @PathVariable Long id,
            @RequestBody RegisterRequest request
    ) {
        if (request.getStudentId() == null) {
            return ResponseEntity.badRequest().body(new ErrorBody("studentId is required."));
        }

        Event event = eventRepository.findById(id).orElse(null);
        if (event == null) {
            return ResponseEntity.status(404).body(new ErrorBody("Event not found."));
        }

        Student student = studentRepository.findById(request.getStudentId()).orElse(null);
        if (student == null) {
            return ResponseEntity.status(404).body(new ErrorBody("Student not found."));
        }

        // FIX: Check student belongs to the event's department
        if (event.getDepartment() != null && student.getDepartment() != null
                && !event.getDepartment().getId().equals(student.getDepartment().getId())) {
            return ResponseEntity.status(403).body(
                    new ErrorBody("Only " + event.getDepartment().getName() + " students can register for this event.")
            );
        }

        // FIX: Check registration deadline
        if (event.getRegistrationDeadline() != null
                && java.time.LocalDateTime.now().isAfter(event.getRegistrationDeadline())) {
            return ResponseEntity.status(400).body(new ErrorBody("Registration deadline has passed."));
        }

        // FIX: Duplicate check
        if (registrationRepository.findByEvent_IdAndStudent_Id(id, student.getId()).isPresent()) {
            return ResponseEntity.status(409).body(new ErrorBody("You're already registered for this event."));
        }

        EventRegistration reg = new EventRegistration();
        reg.setEvent(event);
        reg.setStudent(student);
        registrationRepository.save(reg);

        return ResponseEntity.ok(new SuccessBody("Registered successfully for " + event.getTitle() + "."));
    }

    // ---------------------------------------------------------------
    // Mappers
    // ---------------------------------------------------------------

    private EventSummaryDto toSummary(Event e) {
        return new EventSummaryDto(
                e.getId(), e.getTitle(), e.getSubtitle(),
                e.getEventDate(), e.getStartTime(), e.getEndTime(),
                buildTags(e)
        );
    }

    private EventDetailDto toDetail(Event e, boolean registered) {
        return new EventDetailDto(
                e.getId(), e.getTitle(), e.getSubtitle(),
                e.getEventDate(), e.getStartTime(), e.getEndTime(),
                e.getVenue(), e.getEligibility(), e.getDescription(),
                e.getTeamSize(), e.getRegistrationDeadline(),
                buildTags(e), registered
        );
    }

    private List<String> buildTags(Event e) {
        List<String> tags = new ArrayList<>();
        if (e.getDepartment() != null) {
            String deptName = e.getDepartment().getName();
            tags.add(deptName.contains("Information Technology") ? "IT Department Event" : deptName + " Event");
        }
        if (e.getCategory() != null) {
            tags.add(e.getCategory().getName());
        }
        return tags;
    }

    record ErrorBody(String message) {}
    record SuccessBody(String message) {}
}
