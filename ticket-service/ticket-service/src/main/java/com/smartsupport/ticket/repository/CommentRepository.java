package com.smartsupport.ticket.repository;

import com.smartsupport.ticket.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment,Long> {
    List<Comment> findByTicketId(Long ticketId);
}
