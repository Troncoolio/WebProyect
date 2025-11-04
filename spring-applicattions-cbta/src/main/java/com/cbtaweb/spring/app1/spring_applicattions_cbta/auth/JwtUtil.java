package com.cbtaweb.spring.app1.spring_applicattions_cbta.auth;

import io.jsonwebtoken.*;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private Long expirationMs;

    public String generateToken(String username, String role, Long userId){
        return Jwts.builder()
                .setSubject(username == null ? userId.toString() : username)
                .claim("role", role)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(SignatureAlgorithm.HS256, secret.getBytes())
                .compact();
    }
    public Jws<Claims> validateToken(String token) {
        return Jwts.parser().setSigningKey(secret.getBytes()).parseClaimsJws(token);
    }
}
