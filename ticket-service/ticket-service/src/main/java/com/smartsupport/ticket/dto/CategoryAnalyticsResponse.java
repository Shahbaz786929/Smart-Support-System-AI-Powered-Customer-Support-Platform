package com.smartsupport.ticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryAnalyticsResponse {

    private String category;
    private Long count;

}