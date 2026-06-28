package com.smartsupport.ticket.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingRequest {
    private Integer rating;  // 1-5
    private String comment;
}