package com.smartsupport.ticket.service;

import com.smartsupport.ticket.dto.DashboardResponse;
import com.smartsupport.ticket.dto.MonthlyTrendResponse;

import java.util.List;

public interface DashboardService {

    DashboardResponse getDashboardData();
    List<MonthlyTrendResponse> getMonthlyTrend();
}