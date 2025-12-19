package com.example.zoopark.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public class TicketDtos {

    public record TicketPurchaseRequest(
            @NotNull @Min(1) Integer quantity,
            Long eventId
    ) {
    }

    public record TicketResponse(
            Long id,
            String code,
            String userEmail,
            Long eventId,
            OffsetDateTime createdAt,
            Boolean paid
    ) {
    }
}



