package com.smartsupport.ticket.controller;

import com.smartsupport.ticket.entity.Attachment;
import com.smartsupport.ticket.service.AttachmentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(
            AttachmentService attachmentService){

        this.attachmentService = attachmentService;
    }

    @GetMapping("/{ticketId}")
    public List<Attachment> getAttachments(
            @PathVariable Long ticketId){

        return attachmentService
                .getAttachments(
                        ticketId
                );
    }

    @PostMapping("/{ticketId}")
    public Attachment uploadFile(
            @PathVariable Long ticketId,
            @RequestParam("file")
            MultipartFile file)
            throws IOException {

        return attachmentService
                .uploadFile(ticketId, file);
    }
}