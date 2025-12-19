package com.example.zoopark.controller;

import com.example.zoopark.dto.TicketDtos.TicketPurchaseRequest;
import com.example.zoopark.dto.TicketDtos.TicketResponse;
import com.example.zoopark.model.User;
import com.example.zoopark.repository.UserRepository;
import com.example.zoopark.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    public TicketController(TicketService ticketService, UserRepository userRepository) {
        this.ticketService = ticketService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> list(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return ResponseEntity.ok(ticketService.listTickets(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> get(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return ResponseEntity.ok(ticketService.getTicket(id, user));
    }

    @PostMapping
    public ResponseEntity<List<TicketResponse>> create(@Valid @RequestBody TicketPurchaseRequest request,
                                                       Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return ResponseEntity.ok(ticketService.createTickets(request, user));
    }
}


