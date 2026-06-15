package com.smartsupport.ticket.serviceImpl;

import com.smartsupport.ticket.entity.Attachment;
import com.smartsupport.ticket.entity.Ticket;
import com.smartsupport.ticket.repository.AttachmentRepository;
import com.smartsupport.ticket.repository.TicketRepository;
import com.smartsupport.ticket.service.AttachmentService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class AttachmentServiceImpl
        implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;

    public AttachmentServiceImpl(
            AttachmentRepository attachmentRepository,
            TicketRepository ticketRepository) {

        this.attachmentRepository = attachmentRepository;
        this.ticketRepository = ticketRepository;
    }

    @Override
    public Attachment uploadFile(
            Long ticketId,
            MultipartFile file)
            throws IOException {

        Ticket ticket =
                ticketRepository.findById(ticketId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket not found"));

        // uploads folder create

        String uploadDir =
                System.getProperty("user.dir")
                        + "/uploads/";

        File directory = new File(uploadDir);

        if (!directory.exists()) {

            directory.mkdirs();

        }

        // unique filename

        String fileName =
                UUID.randomUUID()
                        + "_"
                        + file.getOriginalFilename();

        String filePath =
                uploadDir + fileName;

        // save file

        file.transferTo(
                new File(filePath)
        );

        Attachment attachment =
                new Attachment();

        attachment.setFileName(fileName);

        attachment.setFilePath("/uploads/" + fileName);

        attachment.setTicket(ticket);

        return attachmentRepository
                .save(attachment);
    }

    @Override
    public List<Attachment> getAttachments(
            Long ticketId) {

        return attachmentRepository
                .findByTicketId(ticketId);
    }
}