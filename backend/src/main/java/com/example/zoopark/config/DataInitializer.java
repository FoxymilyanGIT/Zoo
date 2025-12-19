package com.example.zoopark.config;

import com.example.zoopark.model.Role;
import com.example.zoopark.model.User;
import com.example.zoopark.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Инициализация базовых пользователей (admin и обычный user) при первом запуске.
 * Пароли хэшируются через BCrypt при старте приложения.
 */
@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.findByEmail("admin@example.com")
                    .orElseGet(() -> {
                        User admin = new User();
                        admin.setEmail("admin@example.com");
                        admin.setPasswordHash(passwordEncoder.encode("Passw0rd!"));
                        admin.setRole(Role.ADMIN);
                        return userRepository.save(admin);
                    });

            userRepository.findByEmail("user@example.com")
                    .orElseGet(() -> {
                        User user = new User();
                        user.setEmail("user@example.com");
                        user.setPasswordHash(passwordEncoder.encode("User1234!"));
                        user.setRole(Role.USER);
                        return userRepository.save(user);
                    });
        };
    }
}


