package com.smartsupport.ticket.repository;

import com.smartsupport.ticket.entity.TicketRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface TicketRatingRepository extends JpaRepository<TicketRating, Long> {

    Optional<TicketRating> findByTicketId(Long ticketId);

    boolean existsByTicketId(Long ticketId);

    List<TicketRating> findAllByOrderByCreatedAtDesc();

    @Query("SELECT AVG(r.rating) FROM TicketRating r")
    Double findAverageRating();

    @Query("SELECT COUNT(r) FROM TicketRating r WHERE r.rating >= 4")
    Long countPositiveRatings();

    @Query("SELECT COUNT(r) FROM TicketRating r WHERE r.rating <= 2")
    Long countNegativeRatings();
}