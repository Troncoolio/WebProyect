package com.cbtaweb.spring.app1.spring_applicattions_cbta.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.SecurityFilterChain;

import com.cbtaweb.spring.app1.spring_applicattions_cbta.auth.JwtUtil;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    public SecurityConfig(JwtUtil jwtUtil) { this.jwtUtil = jwtUtil; }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas
                .requestMatchers("/", "/login", "/styles/**", "/js/**", "/img/**", "/webjars/**").permitAll()
                // Rutas protegidas por rol
                .requestMatchers("/alumnos/**").hasRole("ALUMNO")
                .requestMatchers("/maestros/**").hasRole("MAESTRO")
                .requestMatchers("/administrativos/**").hasRole("ADMINISTRATIVO")
                .requestMatchers("/aspirantes/**").hasRole("ASPIRANTE")
                // Cualquier otra requiere autenticación
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
                .successHandler((request, response, authentication) -> {
                    // Obtiene el rol del usuario logueado
                    String role = authentication.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();

                    // Redirige según el rol
                    switch (role) {
                        case "ROLE_ALUMNO":
                            response.sendRedirect("/alumnos/inicio");
                            break;
                        case "ROLE_MAESTRO":
                            response.sendRedirect("/maestros/inicio");
                            break;
                        case "ROLE_ADMINISTRATIVO":
                            response.sendRedirect("/administrativos/inicio");
                            break;
                        case "ROLE_ASPIRANTE":
                            response.sendRedirect("/aspirantes/inicio");
                            break;
                        default:
                            response.sendRedirect("/");
                            break;
                    }
                })
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
