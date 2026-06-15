package com.smartsupport.ticket.service;

import com.smartsupport.ticket.dto.*;

import java.util.List;

public interface AdminAnalyticsService {

    AdminSummaryResponse getSummary();
    List<CategoryAnalyticsResponse> getCategoryAnalytics();
    List<PriorityAnalyticsResponse> getPriorityAnalytics();
    List<UserActivityResponse> getMostActiveUsers();
    List<MonthlyTrendResponse> getMonthlyStatistics();

}