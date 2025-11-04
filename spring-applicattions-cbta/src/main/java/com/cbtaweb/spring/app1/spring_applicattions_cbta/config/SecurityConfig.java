package com.cbtaweb.spring.app1.spring_applicattions_cbta.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import com.cbtaweb.spring.app1.spring_applicattions_cbta.auth.JwtUtil;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    public SecurityConfig(JwtUtil jwtUtil) { this.jwtUtil = jwtUtil; }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desactiva CSRF temporalmente
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/index", "/", "/styles/**", "/js/**", "/img/**", "/webjars/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            )
            .logout(logout -> logout.permitAll());

        return http.build();
    }
}



