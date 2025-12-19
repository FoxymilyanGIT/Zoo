package com.example.zoopark.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class AnimalDtos {

    public record AnimalRequest(
            @NotBlank String name,
            @NotBlank String species,
            @NotBlank String zone,
            @NotBlank String status,
            @NotBlank String description,
            List<String> imageUrls  // Может быть null или пустым
    ) {
    }

    public record AnimalResponse(
            Long id,
            String name,
            String species,
            String zone,
            String status,
            String description,
            List<String> imageUrls
    ) {
    }
}



