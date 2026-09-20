package com.campusflow.pass;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EventPassRepository extends JpaRepository<EventPass, Long> {
    Optional<EventPass> findByRegistration_Id(Long registrationId);
    Optional<EventPass> findByToken(String token);
}
