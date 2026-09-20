package com.campusflow.pass;

import jakarta.validation.constraints.NotBlank;

public record CheckInRequest(@NotBlank String token) {
}
