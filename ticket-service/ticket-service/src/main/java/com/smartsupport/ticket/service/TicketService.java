package com.smartsupport.ticket.service;

import com.smartsupport.ticket.ai.AiService;
import com.smartsupport.ticket.dto.MonthlyTrendResponse;
import com.smartsupport.ticket.dto.TicketRequest;
import com.smartsupport.ticket.entity.Ticket;
import com.smartsupport.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final AiService aiService;

    // AI Generated
    public String createTicket(TicketRequest request, String email) {

        String category = aiService.categorizeTicket(
                request.getDescription()
        );

        String priority = aiService.predictPriority(
                request.getDescription()
        );

        String summary = aiService.summarizeTicket(
                request.getDescription()
        );

        Ticket ticket = Ticket.builder()
                .userEmail(email)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .priority(priority)
                .summary(summary)
                .status("OPEN")
                .createdAt(LocalDateTime.now())
                .build();

        ticketRepository.save(ticket);

        return "Ticket Created Successfully";
    }

    // static value set
//    public String createTicket(TicketRequest request, String email) {
//
//        String category = "General";
//
//        Ticket ticket = Ticket.builder()
//                .userEmail(email)
//                .title(request.getTitle())
//                .description(request.getDescription())
//                .category(category)
//                .priority("MEDIUM")
//                .status("OPEN")
//                .createdAt(LocalDateTime.now())
//                .build();
//
//        ticketRepository.save(ticket);
//
//        return "Ticket Created Successfully";
//    }

    public List<Ticket> getAllTicket() {
        return ticketRepository.findAll();
    }

    public String updateTicketStatus(
            Long id,
            String status) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket Not Found"
                        ));

        ticket.setStatus(status);

        ticketRepository.save(ticket);

        return "Ticket Status Updated";
    }

    public List<Ticket> getMyTickets(String email) {
        return ticketRepository.findByUserEmail(email);
    }

    public Long getTotalTickets() {
        return ticketRepository.count();
    }

    public Long getOpenTickets() {
        return ticketRepository.countByStatus("OPEN");
    }

    public Long getClosedTickets() {
        return ticketRepository.countByStatus("CLOSED");
    }

    public List<Ticket> getTicketsByStatus(String status) {

        return ticketRepository.findByStatus(status);
    }

    public String deleteTicket(Long id) {

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket Not Found"
                        ));

        ticketRepository.delete(ticket);

        return "Ticket Deleted Successfully";
    }

    public List<Ticket> getLatestTickets() {

        return ticketRepository.findAll(
                Sort.by(
                        Sort.Direction.DESC,
                        "createdAt"
                )
        );
    }

    public List<Ticket> searchTicket(String title) {

        return ticketRepository
                .findByTitleContainingIgnoreCase(title);
    }

    public Page<Ticket> getTickets(
            int page,
            int size) {

        return ticketRepository.findAll(
                PageRequest.of(page, size)
        );
    }

    public List<Ticket> getTicketByPriority(
            String priority) {

        return ticketRepository
                .findByPriority(priority);
    }

    public String assignTicket(
            Long ticketId,
            String agentEmail) {

        Ticket ticket = ticketRepository
                .findById(ticketId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket Not Found"
                        ));

        ticket.setAssignedTo(agentEmail);

        ticketRepository.save(ticket);

        return "Ticket Assigned Successfully";
    }

    public List<Ticket> getAssignedTickets(
            String agentEmail) {

        return ticketRepository
                .findByAssignedTo(agentEmail);
    }

    public List<Ticket> getTicketsByCategory(
            String category) {

        return ticketRepository
                .findByCategory(category);
    }

    public List<MonthlyTrendResponse> getMonthlyTrend() {

        return ticketRepository.getMonthlyTicketTrend();
    }

    public List<Object[]> getCategoryAnalytics() {

        return ticketRepository.getCategoryAnalytics();
    }

    public List<Object[]> getPriorityAnalytics() {

        return ticketRepository.getPriorityAnalytics();
    }

    public List<Object[]> getMostActiveUsers() {

        return ticketRepository.getMostActiveUsers();
    }

    public Ticket getTicketById(Long id){

        return ticketRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket Not Found"
                        ));
    }
}