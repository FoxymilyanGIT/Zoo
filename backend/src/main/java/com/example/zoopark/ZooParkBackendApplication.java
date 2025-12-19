package com.example.zoopark;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;

@SpringBootApplication
public class ZooParkBackendApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(ZooParkBackendApplication.class);
        app.addListeners((ApplicationListener<ApplicationEnvironmentPreparedEvent>) event -> {
            System.out.println("=== ENVIRONMENT VARIABLES ===");
            System.out.println("DATABASE_URL: " + System.getenv("DATABASE_URL"));
            System.out.println("SPRING_PROFILES_ACTIVE: " + System.getenv("SPRING_PROFILES_ACTIVE"));
            System.out.println("JWT_SECRET: " + (System.getenv("JWT_SECRET") != null ? "***SET***" : "NOT SET"));
            System.out.println("PORT: " + System.getenv("PORT"));
            System.out.println("=== END ENVIRONMENT ===");
        });
        app.run(args);
    }

}

