package com.campusflow.registration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegistrationRequest(
        @NotBlank String studentName,
        @NotBlank @Email String studentEmail) {
}
