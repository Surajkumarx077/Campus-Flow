package com.campusflow.registration;

import java.util.List;

import com.campusflow.event.Event;
import com.campusflow.event.EventRepository;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1")
public class RegistrationController {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    public RegistrationController(RegistrationRepository registrationRepository, EventRepository eventRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
    }

    @GetMapping("/registrations")
    public List<Registration> listRegistrations() {
        return registrationRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/events/{eventId}/registrations")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Registration register(@PathVariable Long eventId, @Valid @RequestBody RegistrationRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        if (registrationRepository.existsByEvent_IdAndStudentEmail(eventId, request.studentEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Student is already registered");
        }
        event.addRegistration();
        return registrationRepository.save(new Registration(event, request.studentName(), request.studentEmail()));
    }
}
