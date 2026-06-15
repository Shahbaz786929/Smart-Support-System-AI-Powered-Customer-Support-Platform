package com.smartsupport.ticket.service;

import com.smartsupport.ticket.entity.Attachment;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AttachmentService {

    Attachment uploadFile(
            Long ticketId,
            MultipartFile file
    ) throws IOException;

    List<Attachment> getAttachments(
            Long ticketId
    );
}