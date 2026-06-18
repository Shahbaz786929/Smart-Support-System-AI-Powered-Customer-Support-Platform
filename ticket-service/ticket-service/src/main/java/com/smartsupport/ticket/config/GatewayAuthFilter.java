package com.smartsupport.ticket.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class GatewayAuthFilter extends OncePerRequestFilter {

    @Value("${internal.gateway.secret}")
    private String gatewaySecret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (path.startsWith("/uploads")) {
            filterChain.doFilter(request, response);
            return;
        }

        String incomingSecret = request.getHeader("X-Internal-Secret");

        if (incomingSecret == null || !incomingSecret.equals(gatewaySecret)) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.getWriter().write("Direct access not allowed. Use the API Gateway.");
            return;
        }

        String email = request.getHeader("X-User-Email");
        String role = request.getHeader("X-User-Role");

        if (email == null || email.isBlank()) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        role != null ? List.of(new SimpleGrantedAuthority(role)) : List.of()
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}