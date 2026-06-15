package com.smartsupport.ticket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name="comments")
@Getter
@Setter
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private String userEmail;

    @ManyToOne
    @JoinColumn(name="ticket_id")
    @JsonIgnore
    private Ticket ticket;
    private LocalDateTime createdAt;

}