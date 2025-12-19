package com.example.zoopark.service;

import com.example.zoopark.dto.TicketDtos.TicketPurchaseRequest;
import com.example.zoopark.dto.TicketDtos.TicketResponse;
import com.example.zoopark.model.Event;
import com.example.zoopark.model.Ticket;
import com.example.zoopark.model.User;
import com.example.zoopark.repository.EventRepository;
import com.example.zoopark.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;

    public TicketService(TicketRepository ticketRepository,
                         EventRepository eventRepository) {
        this.ticketRepository = ticketRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> listTickets(User requester) {
        List<Ticket> tickets = requester.getRole().name().equals("ADMIN")
                ? ticketRepository.findAll()
                : ticketRepository.findByUser(requester);
        return tickets.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicket(Long id, User requester) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Ticket not found"));
        if (!requester.getRole().name().equals("ADMIN")
                && !ticket.getUser().getId().equals(requester.getId())) {
            throw new ResponseStatusException(FORBIDDEN, "Not allowed");
        }
        return toResponse(ticket);
    }

    @Transactional
    public List<TicketResponse> createTickets(TicketPurchaseRequest request, User user) {
        Event event = null;
        if (request.eventId() != null) {
            event = eventRepository.findById(request.eventId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Event not found"));
            if (event.getBookedCount() + request.quantity() > event.getCapacity()) {
                throw new ResponseStatusException(FORBIDDEN, "Not enough seats for the event");
            }
            event.setBookedCount(event.getBookedCount() + request.quantity());
            eventRepository.save(event);
        }

        List<TicketResponse> responses = new ArrayList<>();
        for (int i = 0; i < request.quantity(); i++) {
            Ticket ticket = new Ticket();
            ticket.setCode("TCK-" + UUID.randomUUID());
            ticket.setUser(user);
            ticket.setEvent(event);
            ticket.setPaid(true); // имитация оплаты
            Ticket saved = ticketRepository.save(ticket);
            responses.add(toResponse(saved));
        }
        return responses;
    }

    private TicketResponse toResponse(Ticket ticket) {
        Long eventId = ticket.getEvent() != null ? ticket.getEvent().getId() : null;
        return new TicketResponse(
                ticket.getId(),
                ticket.getCode(),
                ticket.getUser().getEmail(),
                eventId,
                ticket.getCreatedAt(),
                ticket.getPaid()
        );
    }
}


