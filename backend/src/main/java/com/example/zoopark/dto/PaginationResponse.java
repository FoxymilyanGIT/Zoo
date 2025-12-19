package com.example.zoopark.dto;

import java.util.List;

public record PaginationResponse<T>(
        List<T> content,
        long totalElements,
        int totalPages,
        int page,
        int size
) {
}



