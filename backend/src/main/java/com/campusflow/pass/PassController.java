package com.campusflow.pass;

import java.util.Map;

import com.campusflow.registration.Registration;
import com.campusflow.registration.RegistrationRepository;
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
public class PassController {

    private final EventPassRepository passRepository;
    private final RegistrationRepository registrationRepository;

    public PassController(EventPassRepository passRepository, RegistrationRepository registrationRepository) {
        this.passRepository = passRepository;
        this.registrationRepository = registrationRepository;
    }

    @GetMapping("/registrations/{registrationId}/pass")
    @Transactional
    public EventPass getPass(@PathVariable Long registrationId) {
        return passRepository.findByRegistration_Id(registrationId).orElseGet(() -> {
            Registration registration = registrationRepository.findById(registrationId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));
            return passRepository.save(new EventPass(registration));
        });
    }

    @PostMapping("/checkins")
    @Transactional
    public Map<String, Object> checkIn(@Valid @RequestBody CheckInRequest request) {
        EventPass pass = passRepository.findByToken(request.token())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pass not found"));
        if (pass.isCheckedIn()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Pass has already been checked in");
        }
        pass.checkIn();
        return Map.of("status", "CHECKED_IN", "passId", pass.getId(), "studentName", pass.getStudentName());
    }
}
