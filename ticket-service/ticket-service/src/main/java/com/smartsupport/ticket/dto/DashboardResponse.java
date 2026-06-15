package com.smartsupport.ticket.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private long totalTickets;

    private long openTickets;

    private long resolvedTickets;

    private long pendingTickets;

    private long highPriority;

    private long mediumPriority;

    private long lowPriority;
}