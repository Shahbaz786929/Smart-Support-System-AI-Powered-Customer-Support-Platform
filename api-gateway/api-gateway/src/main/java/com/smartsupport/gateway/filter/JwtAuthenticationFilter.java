package com.smartsupport.gateway.filter;

import com.smartsupport.gateway.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Value("${internal.gateway.secret}")
    private String internalSecret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (path.startsWith("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }

        String token = authHeader.substring(7);

        boolean valid = jwtUtil.validateToken(token);

        if (!valid) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }

        Claims claims = jwtUtil.extractClaims(token);
        String role = claims.get("role", String.class);
        String email = jwtUtil.extractEmail(token);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        email, null, List.of(new SimpleGrantedAuthority(role))
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        if (path.contains("/tickets/all")) {
            if (!role.equals("ROLE_ADMIN")) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                return;
            }
        }

        HttpServletRequestWrapper wrapper =
                new HttpServletRequestWrapper(request) {

                    @Override
                    public String getHeader(String name) {
                        if ("X-User-Email".equals(name)) return email;
                        if ("X-User-Role".equals(name)) return role;
                        if ("X-Internal-Secret".equals(name)) return internalSecret;
                        return super.getHeader(name);
                    }

                    @Override
                    public Enumeration<String> getHeaders(String name) {
                        if ("X-User-Email".equals(name)) return Collections.enumeration(List.of(email));
                        if ("X-User-Role".equals(name)) return Collections.enumeration(List.of(role));
                        if ("X-Internal-Secret".equals(name)) return Collections.enumeration(List.of(internalSecret));
                        return super.getHeaders(name);
                    }

                    @Override
                    public Enumeration<String> getHeaderNames() {
                        List<String> headerNames = Collections.list(super.getHeaderNames());
                        headerNames.add("X-User-Email");
                        headerNames.add("X-User-Role");
                        headerNames.add("X-Internal-Secret");
                        return Collections.enumeration(headerNames);
                    }
                };

        filterChain.doFilter(wrapper, response);
    }
}