package com.cbtaweb.spring.app1.spring_applicattions_cbta.auth;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.cbtaweb.spring.app1.spring_applicattions_cbta.models.Usuario;
import com.cbtaweb.spring.app1.spring_applicattions_cbta.repository.*;

@Service
public class AuthService {
    private  UsuarioRepository usuarioRepo;
    private BCryptPasswordEncoder en;

    public AuthService(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
        this.en = new BCryptPasswordEncoder();
    }
        public Optional<Usuario> authenticateAlumnoByNcontrol(String ncontrol, String password, AlumnoRepository alumnoRepo) {
        // Buscar alumno por ncontrol
        var optAlumno = alumnoRepo.findByNcontrol(ncontrol);
        if (optAlumno.isEmpty()) return Optional.empty();
        Integer alumnoId = optAlumno.get().getId().intValue();
        var optUsuario = usuarioRepo.findByAlumnoId(alumnoId);
        if (optUsuario.isEmpty()) return Optional.empty();
        Usuario user = optUsuario.get();
        if (en.matches(password, user.getPassword())) return Optional.of(user);
        return Optional.empty();
    }

    public boolean passwordMatches(String raw, String hash) {
        return en.matches(raw, hash);
    }

    public String hashPassword(String raw) {
        return en.encode(raw);
    }
}
