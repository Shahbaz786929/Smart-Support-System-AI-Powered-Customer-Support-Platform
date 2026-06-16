package com.smartsupport.ticket.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "AUTH-SERVICE",
        url = "${auth.service.url}"
)
public interface UserClient {

    @GetMapping("/api/admin/users/count")
    long getTotalUsers();
}