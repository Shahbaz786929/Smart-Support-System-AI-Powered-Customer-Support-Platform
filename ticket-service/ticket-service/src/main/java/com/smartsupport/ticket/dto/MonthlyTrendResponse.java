package com.smartsupport.ticket.dto;

public class MonthlyTrendResponse {

    private String month;
    private Long totalTickets;

    public MonthlyTrendResponse() {
    }

    public MonthlyTrendResponse(
            String month,
            Long totalTickets
    ) {
        this.month = month;
        this.totalTickets = totalTickets;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(Long totalTickets) {
        this.totalTickets = totalTickets;
    }
}