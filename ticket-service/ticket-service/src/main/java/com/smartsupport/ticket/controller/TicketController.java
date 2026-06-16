package com.smartsupport.ticket.controller;

import com.smartsupport.ticket.dashboard.StatsResponse;
import com.smartsupport.ticket.dto.MonthlyTrendResponse;
import com.smartsupport.ticket.dto.TicketRequest;
import com.smartsupport.ticket.dto.UpdateStatusRequest;
import com.smartsupport.ticket.entity.Ticket;
import com.smartsupport.ticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "https://smart-support-system-ai-powered-cus.vercel.app"
        }
)
public class TicketController {

    private final TicketService ticketService;

//    @PostMapping("/create")
//    public String createTicket(@RequestBody TicketRequest request) {
//
//        return ticketService.createTicket(request);
//    }

    @PostMapping("/create")
    public String createTicket(
            @RequestBody TicketRequest request,
            @RequestHeader("X-User-Email") String email) {

        return ticketService.createTicket(
                request,
                email
        );
    }

    // Admin
    @GetMapping("/all")
    public List<Ticket> getAllTicket() {
        return ticketService.getAllTicket();
    }

    //ticket status
    @PutMapping("/status/{id}")
    public String updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        return ticketService.updateTicketStatus(id,request.getStatus());
    }

    @GetMapping("/my")
    public List<Ticket> getMyTickets(@RequestHeader("X-User-Email") String email){

        return ticketService.getMyTickets(email);
    }

    @GetMapping("/stats")
    public StatsResponse getStats(){

        return new StatsResponse(
                ticketService.getTotalTickets(),
                ticketService.getOpenTickets(),
                ticketService.getClosedTickets()
        );
    }

    @GetMapping("/status")
    public List<Ticket> getTicketsByStatus(
            @RequestParam String status){

        return ticketService.getTicketsByStatus(status);
    }

    @DeleteMapping("/{id}")
    public String deleteTicket(
            @PathVariable Long id){

        return ticketService.deleteTicket(id);
    }

    @GetMapping("/latest")
    public List<Ticket> getLatestTickets(){

        return ticketService.getLatestTickets();
    }

    @GetMapping("/search")
    public List<Ticket> searchTicket(@RequestParam String title){

        return ticketService.searchTicket(title);
    }

    //Pagination
    @GetMapping("/page")
    public Page<Ticket> getTickets(@RequestParam int page, @RequestParam int size){

        return ticketService.getTickets(page, size);
    }

    @GetMapping("/priority")
    public List<Ticket> getTicketByPriority(@RequestParam String priority){

        return ticketService.getTicketByPriority(priority);
    }

    @GetMapping("/assigned")
    public List<Ticket> getAssignedTickets(
            @RequestParam String agentEmail){

        return ticketService
                .getAssignedTickets(agentEmail);
    }

    @PutMapping("/assign/{id}")
    public String assignTicket(
            @PathVariable Long id,
            @RequestParam String agentEmail){

        return ticketService.assignTicket(
                id,
                agentEmail
        );
    }

    @GetMapping("/category/{category}")
    public List<Ticket> getTicketsByCategory(
            @PathVariable String category){

        return ticketService
                .getTicketsByCategory(category);
    }

    @GetMapping("/analytics/monthly")
    public List<MonthlyTrendResponse> monthlyTrend() {

        return ticketService.getMonthlyTrend();
    }

    @GetMapping("/analytics/category")
    public List<Object[]> categoryAnalytics() {

        return ticketService.getCategoryAnalytics();
    }

    @GetMapping("/analytics/priority")
    public List<Object[]> priorityAnalytics() {

        return ticketService.getPriorityAnalytics();
    }

    @GetMapping("/analytics/users")
    public List<Object[]> mostActiveUsers() {

        return ticketService.getMostActiveUsers();
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(
            @PathVariable Long id){

        return ticketService.getTicketById(id);
    }
}