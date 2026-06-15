package com.smartsupport.ticket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserActivityResponse {

    private String userEmail;
    private Long ticketCount;

}