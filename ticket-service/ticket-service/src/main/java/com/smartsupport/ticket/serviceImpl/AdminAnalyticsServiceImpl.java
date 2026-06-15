package com.smartsupport.ticket.serviceImpl;

import com.smartsupport.ticket.client.UserClient;
import com.smartsupport.ticket.dto.*;
import com.smartsupport.ticket.repository.TicketRepository;
import com.smartsupport.ticket.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    private final TicketRepository ticketRepository;
    private final UserClient userClient;

    @Override
    public AdminSummaryResponse getSummary() {

        try {

            long totalUsers = userClient.getTotalUsers();
            log.info("Users: {}", totalUsers);

            long totalTickets = ticketRepository.count();
            log.info("Total Tickets: {}", totalTickets);

            long openTickets =
                    ticketRepository.countByStatus("OPEN");

            long closedTickets =
                    ticketRepository.countByStatus("CLOSED");

            long pendingTickets =
                    ticketRepository.countByStatus("PENDING");

            return new AdminSummaryResponse(
                    totalUsers,
                    totalTickets,
                    openTickets,
                    closedTickets,
                    pendingTickets
            );

        } catch (Exception e) {

            log.error("Analytics Error", e);

            throw e;
        }
    }

    @Override
    public List<CategoryAnalyticsResponse> getCategoryAnalytics() {
        return ticketRepository
                .getCategoryAnalytics()
                .stream()
                .map(obj -> new CategoryAnalyticsResponse(
                        (String)obj[0],
                        (Long)obj[1]
                ))
                .toList();
    }

    @Override
    public List<PriorityAnalyticsResponse> getPriorityAnalytics() {
        return ticketRepository
                .getPriorityAnalytics()
                .stream()
                .map(obj -> new PriorityAnalyticsResponse(
                        (String)obj[0],
                        (Long)obj[1]
                ))
                .toList();
    }

    @Override
    public List<UserActivityResponse> getMostActiveUsers() {
        return ticketRepository
                .getMostActiveUsers()
                .stream()
                .map(obj -> new UserActivityResponse(
                        (String)obj[0],
                        (Long)obj[1]
                ))
                .toList();
    }

    @Override
    public List<MonthlyTrendResponse> getMonthlyStatistics() {
        return ticketRepository
                .getMonthlyTicketTrend();
    }
}