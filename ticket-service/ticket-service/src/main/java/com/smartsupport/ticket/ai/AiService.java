package com.smartsupport.ticket.ai;

import com.google.genai.Client;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String categorizeTicket(String description) {

        Client client = Client.builder()
                .apiKey(apiKey)
                .build();

        String prompt = """
                Analyze this support ticket and return ONLY one category:

                Login Issue
                Payment Issue
                Technical Issue
                Account Issue
                General Query

                Ticket:
                """ + description;

        return client.models.generateContent(
                "gemini-2.5-flash",
                prompt,
                null
        ).text();
    }

    public String predictPriority(String description) {

        Client client = Client.builder()
                .apiKey(apiKey)
                .build();

        String prompt = """
                Analyze this support ticket and return ONLY one:

                HIGH
                MEDIUM
                LOW

                Ticket:
                """ + description;

        return client.models.generateContent(
                "gemini-2.5-flash",
                prompt,
                null
        ).text();
    }

    public String summarizeTicket(String description) {

        Client client = Client.builder()
                .apiKey(apiKey)
                .build();

        return client.models.generateContent(
                "gemini-2.5-flash",
                "Summarize: " + description,
                null
        ).text();
    }
}