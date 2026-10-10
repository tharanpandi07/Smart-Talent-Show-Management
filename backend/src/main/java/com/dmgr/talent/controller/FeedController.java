package com.dmgr.talent.controller;

import com.dmgr.talent.dto.FeedPostDTO;
import com.dmgr.talent.model.*;
import com.dmgr.talent.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    @Autowired
    private EventParticipationPostRepository postRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EventRepository eventRepository;

    private final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public ResponseEntity<List<FeedPostDTO>> getFeed() {
        List<FeedPostDTO> feed = postRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(p -> new FeedPostDTO(
                p.getId(),
                p.getStudent().getName(),
                p.getStudent().getDepartment() != null ? p.getStudent().getDepartment().getName() : "N/A",
                p.getEvent() != null ? p.getEvent().getTitle() : "General",
                p.getImageUrl(),
                p.getCaption(),
                p.getLikesCount(),
                p.getCreatedAt()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(feed);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPost(
            @RequestParam("studentId") Long studentId,
            @RequestParam(value = "eventId", required = false) Long eventId,
            @RequestParam("caption") String caption,
            @RequestParam("image") MultipartFile image) throws IOException {

        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        Event event = null;
        if (eventId != null) {
            event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        }

        Files.createDirectories(Paths.get(UPLOAD_DIR));
        String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.write(filePath, image.getBytes());

        EventParticipationPost post = new EventParticipationPost();
        post.setStudent(student);
        post.setEvent(event);
        post.setCaption(caption);
        post.setImageUrl("/uploads/" + fileName);

        postRepository.save(post);
        return ResponseEntity.ok(Map.of("message", "Posted successfully"));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable Long postId) {
        EventParticipationPost post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikesCount(post.getLikesCount() + 1);
        postRepository.save(post);
        return ResponseEntity.ok(Map.of("likes", post.getLikesCount()));
    }
}