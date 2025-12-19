package com.example.zoopark.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.OffsetDateTime;

public class NewsDtos {

    public record NewsRequest(
            @NotBlank String title,
            @NotBlank String content
    ) {
    }

    public record NewsResponse(
            Long id,
            String title,
            String content,
            OffsetDateTime publishedAt
    ) {
    }
}



