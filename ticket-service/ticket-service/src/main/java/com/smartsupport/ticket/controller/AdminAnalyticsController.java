package com.smartsupport.ticket.controller;

import com.smartsupport.ticket.dto.*;
import com.smartsupport.ticket.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AdminAnalyticsService service;

    @GetMapping("/summary")
    public AdminSummaryResponse getSummary() {

        return service.getSummary();
    }

    @GetMapping("/category")
    public List<CategoryAnalyticsResponse>
    getCategoryAnalytics(){

        return service.getCategoryAnalytics();

    }

    @GetMapping("/priority")
    public List<PriorityAnalyticsResponse>
    getPriorityAnalytics(){

        return service.getPriorityAnalytics();

    }

    @GetMapping("/active-users")
    public List<UserActivityResponse>
    getMostActiveUsers(){

        return service.getMostActiveUsers();

    }

    @GetMapping("/monthly-stats")
    public List<MonthlyTrendResponse>
    getMonthlyStatistics(){

        return service.getMonthlyStatistics();

    }
}