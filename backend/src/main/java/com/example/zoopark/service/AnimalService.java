package com.example.zoopark.service;

import com.example.zoopark.dto.AnimalDtos.AnimalRequest;
import com.example.zoopark.dto.AnimalDtos.AnimalResponse;
import com.example.zoopark.dto.PaginationResponse;
import com.example.zoopark.model.Animal;
import com.example.zoopark.repository.AnimalRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final ObjectMapper objectMapper;

    public AnimalService(AnimalRepository animalRepository, ObjectMapper objectMapper) {
        this.animalRepository = animalRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public PaginationResponse<AnimalResponse> search(String q, String species, String zone, String status, int page, int size) {
        Page<Animal> result = animalRepository.search(q, species, zone, status, PageRequest.of(page, size));
        List<AnimalResponse> mapped = result.getContent().stream()
                .map(this::toResponse)
                .toList();
        return new PaginationResponse<>(
                mapped,
                result.getTotalElements(),
                result.getTotalPages(),
                page,
                size
        );
    }

    @Transactional(readOnly = true)
    public AnimalResponse getById(Long id) {
        return animalRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Animal not found"));
    }

    @Transactional
    public AnimalResponse create(AnimalRequest request) {
        Animal animal = new Animal();
        applyRequest(animal, request);
        return toResponse(animalRepository.save(animal));
    }

    @Transactional
    public AnimalResponse update(Long id, AnimalRequest request) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Animal not found"));
        applyRequest(animal, request);
        return toResponse(animal);
    }

    @Transactional
    public void delete(Long id) {
        if (!animalRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Animal not found");
        }
        animalRepository.deleteById(id);
    }

    private void applyRequest(Animal animal, AnimalRequest request) {
        animal.setName(request.name());
        animal.setSpecies(request.species());
        animal.setZone(request.zone());
        animal.setStatus(request.status());
        animal.setDescription(request.description());
        animal.setImageUrls(writeImages(request.imageUrls()));
    }

    private AnimalResponse toResponse(Animal animal) {
        return new AnimalResponse(
                animal.getId(),
                animal.getName(),
                animal.getSpecies(),
                animal.getZone(),
                animal.getStatus(),
                animal.getDescription(),
                readImages(animal.getImageUrls())
        );
    }

    private String writeImages(List<String> images) {
        if (images == null || images.isEmpty()) {
            return null; // или "[]" если нужен пустой JSON массив
        }
        try {
            return objectMapper.writeValueAsString(images);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize images", e);
        }
    }

    private List<String> readImages(String data) {
        if (data == null || data.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(data, new TypeReference<List<String>>() {
            });
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }
}



