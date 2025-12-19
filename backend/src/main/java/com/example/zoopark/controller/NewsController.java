package com.example.zoopark.controller;

import com.example.zoopark.dto.NewsDtos.NewsRequest;
import com.example.zoopark.dto.NewsDtos.NewsResponse;
import com.example.zoopark.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<List<NewsResponse>> list() {
        return ResponseEntity.ok(newsService.findAll());
    }

    @PostMapping
    public ResponseEntity<NewsResponse> create(@Valid @RequestBody NewsRequest request) {
        return ResponseEntity.ok(newsService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody NewsRequest request) {
        return ResponseEntity.ok(newsService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        newsService.delete(id);
        return ResponseEntity.noContent().build();
    }
}



