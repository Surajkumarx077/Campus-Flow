package com.campusflow.pass;

import java.time.LocalDateTime;
import java.util.UUID;

import com.campusflow.registration.Registration;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "event_passes")
public class EventPass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registration_id", nullable = false, unique = true)
    private Registration registration;

    private String token;
    private LocalDateTime issuedAt;
    private LocalDateTime checkedInAt;

    protected EventPass() {
    }

    public EventPass(Registration registration) {
        this.registration = registration;
        this.token = UUID.randomUUID().toString();
        this.issuedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getRegistrationId() { return registration.getId(); }
    public Long getEventId() { return registration.getEventId(); }
    public String getStudentName() { return registration.getStudentName(); }
    public String getToken() { return token; }
    public LocalDateTime getIssuedAt() { return issuedAt; }
    public LocalDateTime getCheckedInAt() { return checkedInAt; }

    public boolean isCheckedIn() { return checkedInAt != null; }

    public void checkIn() {
        checkedInAt = LocalDateTime.now();
    }
}
