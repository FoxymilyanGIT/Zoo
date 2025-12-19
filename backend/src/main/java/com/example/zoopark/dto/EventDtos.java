package com.example.zoopark.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public class EventDtos {

    public record EventRequest(
            @NotBlank String title,
            @NotBlank String description,
            @NotNull @Future OffsetDateTime startTime,
            @NotNull @Future OffsetDateTime endTime,
            @NotNull @Min(1) Integer capacity,
            String type,
            String meta
    ) {
    }

    public record EventResponse(
            Long id,
            String title,
            String description,
            OffsetDateTime startTime,
            OffsetDateTime endTime,
            Integer capacity,
            Integer bookedCount,
            String type,
            String meta
    ) {
    }
}



