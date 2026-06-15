package com.smartsupport.ticket.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "AUTH-SERVICE")
public interface UserClient {

    @GetMapping("/api/admin/users/count")
    long getTotalUsers();
}