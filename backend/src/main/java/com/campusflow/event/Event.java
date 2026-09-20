package com.campusflow.event;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private String venue;
    private LocalDate eventDate;
    private String status;
    private int registrations;
    private LocalDateTime createdAt;

    protected Event() {
    }

    public Event(String title, String category, String venue, LocalDate eventDate) {
        this.title = title;
        this.category = category;
        this.venue = venue;
        this.eventDate = eventDate;
        this.status = "REGISTRATION_OPEN";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public String getVenue() { return venue; }
    public LocalDate getEventDate() { return eventDate; }
    public String getStatus() { return status; }
    public int getRegistrations() { return registrations; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void addRegistration() {
        registrations++;
    }
}
