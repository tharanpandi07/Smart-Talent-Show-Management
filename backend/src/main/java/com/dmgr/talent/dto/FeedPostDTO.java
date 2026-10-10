package com.dmgr.talent.dto;

import java.time.LocalDateTime;

public class FeedPostDTO {
    private Long postId;
    private String studentName;
    private String department;
    private String eventName;
    private String imageUrl;
    private String caption;
    private Integer likesCount;
    private LocalDateTime createdAt;

    public FeedPostDTO(Long postId, String studentName, String department, String eventName,
                        String imageUrl, String caption, Integer likesCount, LocalDateTime createdAt) {
        this.postId = postId;
        this.studentName = studentName;
        this.department = department;
        this.eventName = eventName;
        this.imageUrl = imageUrl;
        this.caption = caption;
        this.likesCount = likesCount;
        this.createdAt = createdAt;
    }

    public Long getPostId() { return postId; }
    public String getStudentName() { return studentName; }
    public String getDepartment() { return department; }
    public String getEventName() { return eventName; }
    public String getImageUrl() { return imageUrl; }
    public String getCaption() { return caption; }
    public Integer getLikesCount() { return likesCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}