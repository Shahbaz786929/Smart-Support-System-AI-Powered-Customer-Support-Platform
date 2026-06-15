package com.smartsupport.ticket.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class StatsResponse {

    private Long totalTickets;
    private Long openTickets;
    private Long closedTickets;
}