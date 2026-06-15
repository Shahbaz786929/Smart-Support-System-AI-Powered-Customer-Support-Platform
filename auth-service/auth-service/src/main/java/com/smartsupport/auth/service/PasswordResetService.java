package com.smartsupport.auth.service;

public interface PasswordResetService {

    void generateResetToken(String email);

    void resetPassword(String token, String newPassword);
}