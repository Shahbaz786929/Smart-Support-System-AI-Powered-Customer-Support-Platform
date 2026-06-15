package com.smartsupport.ticket.service;

import com.smartsupport.ticket.dto.CommentRequest;
import com.smartsupport.ticket.entity.Comment;
import com.smartsupport.ticket.entity.Ticket;
import com.smartsupport.ticket.repository.CommentRepository;
import com.smartsupport.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final EmailService emailService;

    public Comment addComment(
            Long ticketId,
            CommentRequest request){

        Ticket ticket =
                ticketRepository.findById(ticketId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket not found"
                                ));

        Comment comment = new Comment();

        comment.setMessage(
                request.getMessage()
        );

        comment.setUserEmail(
                request.getUserEmail()
        );


        comment.setTicket(ticket);
        comment.setCreatedAt(LocalDateTime.now());

        Comment savedComment =
                commentRepository.save(comment);

        return savedComment;
    }

    public List<Comment> getCommentsByTicketId(
            Long ticketId){

        return commentRepository
                .findByTicketId(ticketId);
    }
}