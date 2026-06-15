package com.smartsupport.ticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminSummaryResponse {

    private long totalUsers;
    private long totalTickets;
    private long openTickets;
    private long closedTickets;
    private long pendingTickets;
}