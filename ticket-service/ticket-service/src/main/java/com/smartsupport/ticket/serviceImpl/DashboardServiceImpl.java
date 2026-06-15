package com.smartsupport.ticket.serviceImpl;

import com.smartsupport.ticket.dto.DashboardResponse;
import com.smartsupport.ticket.dto.MonthlyTrendResponse;
import com.smartsupport.ticket.repository.TicketRepository;
import com.smartsupport.ticket.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TicketRepository ticketRepository;

    @Override
    public DashboardResponse getDashboardData() {

        return DashboardResponse.builder()

                .totalTickets(
                        ticketRepository.count()
                )

                .openTickets(
                        ticketRepository.countByStatus("OPEN")
                )

                .resolvedTickets(
                        ticketRepository.countByStatus("RESOLVED")
                )

                .pendingTickets(
                        ticketRepository.countByStatus("PENDING")
                )

                .highPriority(
                        ticketRepository.countByPriority("HIGH")
                )

                .mediumPriority(
                        ticketRepository.countByPriority("MEDIUM")
                )

                .lowPriority(
                        ticketRepository.countByPriority("LOW")
                )

                .build();
    }

    @Override
    public List<MonthlyTrendResponse> getMonthlyTrend() {
        return ticketRepository.getMonthlyTicketTrend();
    }
}