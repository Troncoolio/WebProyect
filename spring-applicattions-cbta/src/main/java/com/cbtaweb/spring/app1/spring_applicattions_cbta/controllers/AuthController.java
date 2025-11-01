package com.cbtaweb.spring.app1.spring_applicattions_cbta.controllers;

import org.springframework.web.bind.annotation.*;

import com.cbtaweb.spring.app1.spring_applicattions_cbta.auth.*;
import com.cbtaweb.spring.app1.spring_applicattions_cbta.models.*;
import com.cbtaweb.spring.app1.spring_applicattions_cbta.repository.*;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final AlumnoRepository alumnoRepo;
    private final UsuarioRepository usuarioRepo;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, AlumnoRepository alumnoRepo,
                          UsuarioRepository usuarioRepo, JwtUtil jwtUtil) {
        this.authService = authService;
        this.alumnoRepo = alumnoRepo;
        this.usuarioRepo = usuarioRepo;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAlumno(@RequestBody LoginRequest req) {
        // req.ncontrol + req.password
        var optUsuario = authService.authenticateAlumnoByNcontrol(req.getNcontrol(), req.getPassword(), alumnoRepo);
        if (optUsuario.isEmpty()) return ResponseEntity.status(401).body("Credenciales inválidas");
        Usuario user = optUsuario.get();
        // subject: podemos usar ncontrol como sujeto
        var alumno = alumnoRepo.findByNControl(req.getNcontrol()).get();
        long userId = user.getId();
        String token = jwtUtil.generateToken(req.getNcontrol(), user.getRol(), userId);
        return ResponseEntity.ok(new LoginResponse(token, user.getRol(), alumno.getId(), alumno.getNombre()));
    }
}
