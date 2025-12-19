package com.example.zoopark.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@Service
public class UploadService {

    private final Path uploadPath;

    public UploadService(@Value("${zoopark.uploads.dir}") String uploadsDir) {
        try {
            this.uploadPath = Path.of(uploadsDir).toAbsolutePath().normalize();
            Files.createDirectories(this.uploadPath);
        } catch (IOException e) {
            throw new IllegalStateException("Cannot initialize uploads directory", e);
        }
    }

    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "Empty file");
        }
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";
        int dot = originalFilename.lastIndexOf('.');
        if (dot > 0) {
            extension = originalFilename.substring(dot);
        }
        String filename = UUID.randomUUID() + extension;
        Path destination = uploadPath.resolve(filename);
        try {
            file.transferTo(destination);
        } catch (IOException e) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Failed to store file");
        }
        return "/uploads/" + filename;
    }
}


