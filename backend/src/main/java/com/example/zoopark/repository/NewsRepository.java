package com.example.zoopark.repository;

import com.example.zoopark.model.News;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, Long> {
}


