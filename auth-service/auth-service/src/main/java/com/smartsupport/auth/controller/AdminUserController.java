package com.smartsupport.auth.controller;

import com.smartsupport.auth.entity.User;
import com.smartsupport.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping("/count")
    public long getUserCount() {
        return userRepository.count();
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/role/{email}")
    public ResponseEntity<String> updateRole(
            @PathVariable String email,
            @RequestParam String role) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok("Role updated to " + role + " for " + email);
    }
}