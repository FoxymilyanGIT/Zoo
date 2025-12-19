package com.example.zoopark.service;

import com.example.zoopark.dto.NewsDtos.NewsRequest;
import com.example.zoopark.dto.NewsDtos.NewsResponse;
import com.example.zoopark.model.News;
import com.example.zoopark.repository.NewsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class NewsService {

    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @Transactional(readOnly = true)
    public List<NewsResponse> findAll() {
        return newsRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getPublishedAt().compareTo(a.getPublishedAt()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public NewsResponse create(NewsRequest request) {
        News news = new News();
        news.setTitle(request.title());
        news.setContent(request.content());
        news.setPublishedAt(OffsetDateTime.now());
        return toResponse(newsRepository.save(news));
    }

    @Transactional
    public NewsResponse update(Long id, NewsRequest request) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "News not found"));
        news.setTitle(request.title());
        news.setContent(request.content());
        return toResponse(news);
    }

    @Transactional
    public void delete(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "News not found");
        }
        newsRepository.deleteById(id);
    }

    private NewsResponse toResponse(News news) {
        return new NewsResponse(news.getId(), news.getTitle(), news.getContent(), news.getPublishedAt());
    }
}



