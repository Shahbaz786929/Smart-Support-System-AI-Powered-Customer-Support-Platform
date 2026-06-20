package com.smartsupport.ticket.controller;

import com.google.genai.Client;
import com.smartsupport.ticket.dto.ChatRequest;
import com.smartsupport.ticket.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    @Value("${gemini.api.key}")
    private String apiKey;

    @PostMapping("/ask")
    public ChatResponse ask(
            @RequestBody ChatRequest request,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {

        String prompt = """
                You are a helpful AI support assistant for "Smart Support", a customer support ticket management platform.

                Your job is to help users with:
                - How to create tickets
                - Checking ticket status
                - Understanding ticket categories and priorities (HIGH, MEDIUM, LOW)
                - Password reset and account issues
                - General guidance on using the platform

                Keep answers concise, friendly, and helpful. Max 3-4 sentences.
                If the user asks something unrelated to support or the platform, politely redirect them.

                User message: """ + request.getMessage();

        Client client = Client.builder()
                .apiKey(apiKey)
                .build();

        String reply = client.models.generateContent(
                "gemini-2.5-flash",
                prompt,
                null
        ).text();

        return new ChatResponse(reply.trim());
    }
}