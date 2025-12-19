package com.example.zoopark.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

@RestController
public class HealthController {

    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = Map.of(
            "status", "UP",
            "service", "ZooPark Backend",
            "timestamp", java.time.Instant.now().toString(),
            "database", checkDatabaseConnection()
        );
        return ResponseEntity.ok(health);
    }

    private String checkDatabaseConnection() {
        try {
            if (jdbcTemplate != null) {
                jdbcTemplate.execute("SELECT 1");
                return "CONNECTED";
            } else {
                return "NO_CONNECTION";
            }
        } catch (Exception e) {
            return "ERROR: " + e.getMessage();
        }
    }
}
