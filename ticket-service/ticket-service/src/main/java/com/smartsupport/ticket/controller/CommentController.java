package com.smartsupport.ticket.controller;

import com.smartsupport.ticket.dto.CommentRequest;
import com.smartsupport.ticket.entity.Comment;
import com.smartsupport.ticket.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(
            CommentService commentService){

        this.commentService = commentService;
    }

    @PostMapping("/{ticketId}")
    public Comment addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentRequest request){

        return commentService.addComment(
                ticketId,
                request
        );
    }

    @GetMapping("/{ticketId}")
    public List<Comment> getComments(
            @PathVariable Long ticketId){

        return commentService
                .getCommentsByTicketId(
                        ticketId
                );
    }
}