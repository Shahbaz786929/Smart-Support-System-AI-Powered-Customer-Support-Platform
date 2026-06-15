package com.smartsupport.auth.service;

import com.smartsupport.auth.dto.*;
import com.smartsupport.auth.entity.User;
import com.smartsupport.auth.exception.InvalidPasswordException;
import com.smartsupport.auth.exception.UserAlreadyExistsException;
import com.smartsupport.auth.exception.UserNotFoundException;
import com.smartsupport.auth.repository.UserRepository;
import com.smartsupport.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private final RefreshTokenService refreshTokenService;

    private final PasswordResetService passwordResetService;


    // Register
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException(
                    "Email already exists"
            );
        }

        User user = User.builder()
                .username(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_USER")
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .message("User Registered Successfully")
                .build();
    }


    // Login
    public AuthResponse login(LoginRequest request) {

        System.out.println(
                "Login Email : " + request.getEmail()
        );

        User user = userRepository.findByEmail(
                request.getEmail()
        ).orElseThrow(() ->
                new UserNotFoundException(
                        "User Not Found"
                ));

        boolean matches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!matches) {
            throw new InvalidPasswordException(
                    "Invalid Password"
            );
        }

        // Access Token
        String accessToken = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        // Refresh Token
        String refreshToken = refreshTokenService
                .createRefreshToken(user.getEmail())
                .getToken();

        return AuthResponse.builder()
                .message("Login Successful")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }


    // Refresh Token
    public AuthResponse refreshToken(
            RefreshRequest request
    ) {

        var refreshTokenEntity =
                refreshTokenService.verifyRefreshToken(
                        request.getRefreshToken()
                );

        User user = userRepository.findByEmail(
                refreshTokenEntity.getEmail()
        ).orElseThrow(() ->
                new UserNotFoundException(
                        "User Not Found"
                ));

        String newAccessToken = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return AuthResponse.builder()
                .message("Token Refreshed Successfully")
                .accessToken(newAccessToken)
                .refreshToken(refreshTokenEntity.getToken())
                .build();
    }

    // forgot Password
    public String forgotPassword(String email) {

        passwordResetService.generateResetToken(email);

        return "Password reset link sent successfully";
    }

    public String resetPassword(
            ResetPasswordRequest request
    ) {

        passwordResetService.resetPassword(
                request.getToken(),
                request.getNewPassword()
        );

        return "Password reset successful";
    }
}