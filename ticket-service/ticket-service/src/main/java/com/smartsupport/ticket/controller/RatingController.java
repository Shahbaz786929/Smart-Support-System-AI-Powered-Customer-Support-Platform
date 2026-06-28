package com.smartsupport.ticket.controller;

import com.smartsupport.ticket.dto.RatingRequest;
import com.smartsupport.ticket.dto.RatingResponse;
import com.smartsupport.ticket.entity.Ticket;
import com.smartsupport.ticket.entity.TicketRating;
import com.smartsupport.ticket.repository.TicketRatingRepository;
import com.smartsupport.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final TicketRatingRepository ratingRepository;
    private final TicketRepository ticketRepository;

    // Submit rating for a resolved ticket
    @PostMapping("/{ticketId}")
    public ResponseEntity<?> submitRating(
            @PathVariable Long ticketId,
            @RequestBody RatingRequest request,
            @RequestHeader("X-User-Email") String userEmail) {

        // Check ticket exists
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Only resolved tickets can be rated
        if (!"RESOLVED".equals(ticket.getStatus())) {
            return ResponseEntity.badRequest()
                    .body("Only RESOLVED tickets can be rated");
        }

        // Only ticket owner can rate
        if (!ticket.getUserEmail().equals(userEmail)) {
            return ResponseEntity.status(403)
                    .body("You can only rate your own tickets");
        }

        // Check if already rated
        if (ratingRepository.existsByTicketId(ticketId)) {
            return ResponseEntity.badRequest()
                    .body("You have already rated this ticket");
        }

        // Validate rating
        if (request.getRating() == null ||
                request.getRating() < 1 ||
                request.getRating() > 5) {
            return ResponseEntity.badRequest()
                    .body("Rating must be between 1 and 5");
        }

        TicketRating rating = TicketRating.builder()
                .ticketId(ticketId)
                .userEmail(userEmail)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        ratingRepository.save(rating);

        return ResponseEntity.ok("Rating submitted successfully");
    }

    // Get rating for a specific ticket
    @GetMapping("/{ticketId}")
    public ResponseEntity<?> getRating(@PathVariable Long ticketId) {

        return ratingRepository.findByTicketId(ticketId)
                .map(r -> ResponseEntity.ok(toResponse(r)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Get all ratings with summary
    @GetMapping("/admin/all")
    public ResponseEntity<Map<String, Object>> getAllRatings() {

        List<TicketRating> ratings = ratingRepository.findAllByOrderByCreatedAtDesc();
        Double avg = ratingRepository.findAverageRating();
        Long positive = ratingRepository.countPositiveRatings();
        Long negative = ratingRepository.countNegativeRatings();

        Map<String, Object> response = new HashMap<>();
        response.put("ratings", ratings.stream().map(this::toResponse).collect(Collectors.toList()));
        response.put("averageRating", avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        response.put("totalRatings", ratings.size());
        response.put("positiveRatings", positive);
        response.put("negativeRatings", negative);

        return ResponseEntity.ok(response);
    }

    private RatingResponse toResponse(TicketRating r) {
        return RatingResponse.builder()
                .id(r.getId())
                .ticketId(r.getTicketId())
                .userEmail(r.getUserEmail())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}