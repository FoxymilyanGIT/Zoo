package com.example.zoopark.controller;

import com.example.zoopark.dto.AnimalDtos.AnimalRequest;
import com.example.zoopark.dto.AnimalDtos.AnimalResponse;
import com.example.zoopark.dto.PaginationResponse;
import com.example.zoopark.service.AnimalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/animals")
public class AnimalController {

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<AnimalResponse>> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String zone,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(animalService.search(q, species, zone, status, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.getById(id));
    }

    @PostMapping
    public ResponseEntity<AnimalResponse> create(@Valid @RequestBody AnimalRequest request) {
        return ResponseEntity.ok(animalService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody AnimalRequest request) {
        return ResponseEntity.ok(animalService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        animalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}



