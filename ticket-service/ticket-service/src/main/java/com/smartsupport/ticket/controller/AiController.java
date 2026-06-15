package com.smartsupport.ticket.controller;

import com.smartsupport.ticket.ai.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/category")
    public String category(
            @RequestBody String description){

        return aiService.categorizeTicket(description);
    }

    @PostMapping("/priority")
    public String priority(
            @RequestBody String description){

        return aiService.predictPriority(description);
    }

    @PostMapping("/summary")
    public String summary(
            @RequestBody String description){

        return aiService.summarizeTicket(description);
    }
}