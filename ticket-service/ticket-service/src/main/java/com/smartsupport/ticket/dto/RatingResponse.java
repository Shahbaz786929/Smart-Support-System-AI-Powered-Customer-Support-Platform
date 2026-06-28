package com.smartsupport.ticket.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponse {
    private Long id;
    private Long ticketId;
    private String userEmail;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}