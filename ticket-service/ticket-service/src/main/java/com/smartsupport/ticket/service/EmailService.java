package com.smartsupport.ticket.service;

public interface EmailService {

    void sendEmail(
            String to,
            String subject,
            String body
    );

}