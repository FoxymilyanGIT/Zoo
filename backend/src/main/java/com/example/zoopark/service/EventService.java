package com.example.zoopark.service;

import com.example.zoopark.dto.EventDtos.EventRequest;
import com.example.zoopark.dto.EventDtos.EventResponse;
import com.example.zoopark.dto.TicketDtos.TicketResponse;
import com.example.zoopark.model.Event;
import com.example.zoopark.model.Ticket;
import com.example.zoopark.model.User;
import com.example.zoopark.repository.EventRepository;
import com.example.zoopark.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

    public EventService(EventRepository eventRepository, TicketRepository ticketRepository) {
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
    }

    @Transactional(readOnly = true)
    public List<EventResponse> search(String q, String type, OffsetDateTime dateFrom, OffsetDateTime dateTo) {
        return eventRepository.search(q, type, dateFrom, dateTo)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse getById(Long id) {
        return eventRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Event not found"));
    }

    @Transactional
    public EventResponse create(EventRequest request) {
        Event event = new Event();
        applyRequest(event, request);
        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse update(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Event not found"));
        applyRequest(event, request);
        return toResponse(event);
    }

    @Transactional
    public void delete(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "Event not found");
        }
        eventRepository.deleteById(id);
    }

    @Transactional
    public TicketResponse register(Long eventId, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Event not found"));
        if (event.getBookedCount() >= event.getCapacity()) {
            throw new ResponseStatusException(BAD_REQUEST, "Event capacity reached");
        }
        event.setBookedCount(event.getBookedCount() + 1);
        eventRepository.save(event);

        Ticket ticket = new Ticket();
        ticket.setCode("EVT-" + UUID.randomUUID());
        ticket.setUser(user);
        ticket.setEvent(event);
        ticket.setPaid(true); // регистрация бесплатная / оплачено заранее
        Ticket saved = ticketRepository.save(ticket);
        return new TicketResponse(saved.getId(), saved.getCode(), user.getEmail(),
                event.getId(), saved.getCreatedAt(), saved.getPaid());
    }

    private void applyRequest(Event event, EventRequest request) {
        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setStartTime(request.startTime());
        event.setEndTime(request.endTime());
        event.setCapacity(request.capacity());
        if (event.getBookedCount() == null) {
            event.setBookedCount(0);
        }
        event.setType(request.type());
        event.setMeta(request.meta());
    }

    private EventResponse toResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getStartTime(),
                event.getEndTime(),
                event.getCapacity(),
                event.getBookedCount(),
                event.getType(),
                event.getMeta()
        );
    }
}


