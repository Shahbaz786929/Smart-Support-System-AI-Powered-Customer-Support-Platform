package com.smartsupport.ticket.controller;

import com.smartsupport.ticket.dto.DashboardResponse;
import com.smartsupport.ticket.dto.MonthlyTrendResponse;
import com.smartsupport.ticket.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard() {

        return dashboardService.getDashboardData();
    }

    @GetMapping("/monthly-trend")
    public List<MonthlyTrendResponse> getMonthlyTrend() {

        return dashboardService.getMonthlyTrend();
    }
}