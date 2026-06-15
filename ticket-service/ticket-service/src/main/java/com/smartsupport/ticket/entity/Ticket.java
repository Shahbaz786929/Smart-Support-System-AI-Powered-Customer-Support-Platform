package com.smartsupport.ticket.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private String title;

    private String description;

    private String category;

    private String priority;

    // use AI integration
    private String summary;

    //Agent Ticket Assignment
    private String assignedTo;

    private String status;

    private LocalDateTime createdAt;
}