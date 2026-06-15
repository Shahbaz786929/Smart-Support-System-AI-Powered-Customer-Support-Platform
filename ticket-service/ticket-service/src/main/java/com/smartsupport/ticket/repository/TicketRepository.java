package com.smartsupport.ticket.repository;

import com.smartsupport.ticket.dto.MonthlyTrendResponse;
import com.smartsupport.ticket.entity.Ticket;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket,Long> {

    List<Ticket> findByUserEmail(String email);

    Long countByStatus(String status);

    List<Ticket> findByStatus(String status);

    List<Ticket> findAll(Sort sort);

    List<Ticket> findByTitleContainingIgnoreCase(String title);

    List<Ticket> findByPriority(String priority);

    List<Ticket> findByAssignedTo(String assignedTo);

    List<Ticket> findByCategory(String category);

    long count();

    long countByPriority(String priority);

    @Query("""
            SELECT new com.smartsupport.ticket.dto.MonthlyTrendResponse(
            CONCAT('', MONTH(t.createdAt)),
            COUNT(t)
            )
            FROM Ticket t
            GROUP BY MONTH(t.createdAt), CONCAT('', MONTH(t.createdAt))
            ORDER BY MONTH(t.createdAt)
            """)
    List<MonthlyTrendResponse> getMonthlyTicketTrend();

    @Query("""
            SELECT t.category, COUNT(t)
            FROM Ticket t
            GROUP BY t.category
            """)
    List<Object[]> getCategoryAnalytics();

    @Query("""
            SELECT t.priority, COUNT(t)
            FROM Ticket t
            GROUP BY t.priority
            """)
    List<Object[]> getPriorityAnalytics();

    @Query("""
            SELECT t.userEmail, COUNT(t)
            FROM Ticket t
            GROUP BY t.userEmail
            ORDER BY COUNT(t) DESC
            """)
    List<Object[]> getMostActiveUsers();

}
