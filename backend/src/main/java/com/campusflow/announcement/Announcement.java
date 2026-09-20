package com.campusflow.announcement;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;
    private String audience;
    private LocalDateTime createdAt;

    protected Announcement() {
    }

    public Announcement(String title, String message, String audience) {
        this.title = title;
        this.message = message;
        this.audience = audience;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getAudience() { return audience; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
