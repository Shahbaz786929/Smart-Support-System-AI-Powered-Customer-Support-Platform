package com.smartsupport.ticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PriorityAnalyticsResponse {

    private String priority;
    private Long count;

}