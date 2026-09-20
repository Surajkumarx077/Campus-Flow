package com.campusflow.registration;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findAllByOrderByCreatedAtDesc();
    boolean existsByEvent_IdAndStudentEmail(Long eventId, String studentEmail);
}
