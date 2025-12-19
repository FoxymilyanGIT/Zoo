package com.example.zoopark.repository;

import com.example.zoopark.model.Ticket;
import com.example.zoopark.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUser(User user);
    Optional<Ticket> findByCode(String code);
}


