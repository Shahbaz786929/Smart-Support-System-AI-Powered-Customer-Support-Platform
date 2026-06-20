package com.smartsupport.auth.service.impl;

import com.smartsupport.auth.entity.PasswordResetToken;
import com.smartsupport.auth.entity.User;
import com.smartsupport.auth.exception.UserNotFoundException;
import com.smartsupport.auth.repository.PasswordResetTokenRepository;
import com.smartsupport.auth.repository.UserRepository;
import com.smartsupport.auth.service.EmailService;
import com.smartsupport.auth.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final PasswordResetTokenRepository resetTokenRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void generateResetToken(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        resetTokenRepository.findByEmail(email)
                .ifPresent(resetTokenRepository::delete);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(UUID.randomUUID().toString())
                .email(email)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();

        resetTokenRepository.save(resetToken);

        String resetLink = frontendUrl + "/reset-password?token=" + resetToken.getToken();

        String subject = "Password Reset Request - Smart Support";

        String body = "Hello,\n\n"
                + "You requested a password reset for your Smart Support account.\n\n"
                + "Click the link below to reset your password:\n\n"
                + resetLink
                + "\n\nThis link expires in 15 minutes.\n\n"
                + "If you did not request this, please ignore this email.\n\n"
                + "Smart Support Team";

        emailService.sendEmail(email, subject, body);
    }

    @Override
    public void resetPassword(String token, String newPassword) {

        PasswordResetToken resetToken = resetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetTokenRepository.delete(resetToken);
    }
}