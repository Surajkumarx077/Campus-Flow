package com.campusflow.analytics;

import java.util.Map;

import com.campusflow.event.EventRepository;
import com.campusflow.pass.EventPassRepository;
import com.campusflow.registration.RegistrationRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final EventPassRepository passRepository;

    public AnalyticsController(EventRepository eventRepository, RegistrationRepository registrationRepository,
            EventPassRepository passRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.passRepository = passRepository;
    }

    @GetMapping("/overview")
    public Map<String, Long> overview() {
        long totalRegistrations = registrationRepository.count();
        long checkedIn = passRepository.findAll().stream().filter(pass -> pass.getCheckedInAt() != null).count();
        return Map.of(
                "activeEvents", eventRepository.count(),
                "totalRegistrations", totalRegistrations,
                "checkedIn", checkedIn,
                "passIssued", passRepository.count());
    }
}
