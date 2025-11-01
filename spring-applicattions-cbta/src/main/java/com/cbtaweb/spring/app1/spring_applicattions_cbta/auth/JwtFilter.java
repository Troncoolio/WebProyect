package com.cbtaweb.spring.app1.spring_applicattions_cbta.auth;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtFilter extends OncePerRequestFilter{
private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) { this.jwtUtil = jwtUtil; }


    @Override
protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
        throws ServletException, IOException {

    // 🔹 Evitar validar token en el login
    String path = req.getRequestURI();
    if (path.startsWith("/auth/login")) {
        chain.doFilter(req, res);
        return;
    }

    String header = req.getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")) {
        String token = header.substring(7);
        try {
            Jws<Claims> claims = jwtUtil.validateToken(token);
            String role = claims.getBody().get("role", String.class);
            String subject = claims.getBody().getSubject();

            var auth = new UsernamePasswordAuthenticationToken(subject, null,
                    Collections.singletonList(() -> role));
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (Exception ex) {
            // token inválido -> no autenticamos
        }
    }

    chain.doFilter(req, res);
}

}
