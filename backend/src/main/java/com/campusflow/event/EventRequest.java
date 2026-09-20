package com.campusflow.event;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EventRequest(
        @NotBlank String title,
        @NotBlank String category,
        @NotBlank String venue,
        @NotNull @FutureOrPresent LocalDate eventDate) {
}
