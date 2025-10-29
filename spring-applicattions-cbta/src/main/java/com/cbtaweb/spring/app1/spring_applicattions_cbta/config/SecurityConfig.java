package com.cbtaweb.spring.app1.spring_applicattions_cbta.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
public class SecurityConfig {
    private final JwtUtil jwtUtil;
    public SecurityConfig() { this.jwtUtil = new JwtUtil(); }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        var jwtFilter = new JwtFilter(jwtUtil);
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**", "/swagger-ui/**", "/v3/api-docs/**", "/static/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Minimal JwtUtil placeholder (replace with real implementation)
    public static class JwtUtil {
        public boolean validateToken(String token) {
            return token != null && !token.isBlank();
        }

        public String getUsername(String token) {
            return "user";
        }
    }

    // Minimal JwtFilter placeholder (replace with real implementation)
    public static class JwtFilter extends OncePerRequestFilter {
        private final JwtUtil jwtUtil;
        public JwtFilter(JwtUtil jwtUtil) { this.jwtUtil = jwtUtil; }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.validateToken(token)) {
                    // in a real implementation set Authentication in SecurityContext here
                }
            }
            filterChain.doFilter(request, response);
        }
    }
}


