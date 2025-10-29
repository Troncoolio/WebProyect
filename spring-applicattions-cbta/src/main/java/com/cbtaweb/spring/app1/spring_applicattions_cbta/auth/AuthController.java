package com.cbtaweb.spring.app1.spring_applicattions_cbta.auth;

import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> loginAlumno(@RequestBody java.util.Map<String, String> req) {
        // accept a simple map to avoid unresolved custom DTO/entity types at compile time
        String ncontrol = req.get("ncontrol");
        String password = req.get("password");
        if (ncontrol == null || password == null) {
            return ResponseEntity.badRequest().body("Faltan credenciales");
        }

        Object optUsuario = authService.authenticateAlumnoByNcontrol(ncontrol, password, alumnoRepo);
        Object usuarioObj = null;
        if (optUsuario instanceof java.util.Optional) {
            usuarioObj = ((java.util.Optional<?>) optUsuario).orElse(null);
        } else {
            usuarioObj = optUsuario;
        }
        if (usuarioObj == null) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        Object alumnoObj = null;
        Object alumnoOpt = alumnoRepo.findByNcontrol(ncontrol);
        if (alumnoOpt instanceof java.util.Optional) {
            alumnoObj = ((java.util.Optional<?>) alumnoOpt).orElse(null);
        } else {
            alumnoObj = alumnoOpt;
        }
        if (alumnoObj == null) {
            return ResponseEntity.status(401).body("Alumno no encontrado");
        }

        String role = safeInvokeString(usuarioObj, "getRol");
        Object userId = safeInvoke(usuarioObj, "getId");
        Long id = (Long) userId;//Dudosa correxion mia posible error
        String token = jwtUtil.generateToken(ncontrol, role, id);

        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("token", token);
        resp.put("role", role);
        resp.put("alumnoId", safeInvoke(alumnoObj, "getId"));
        resp.put("alumnoNombre", safeInvokeString(alumnoObj, "getNombre"));

        return ResponseEntity.ok(resp);
    }

    private Object safeInvoke(Object obj, String methodName) {
        if (obj == null) return null;
        try {
            java.lang.reflect.Method m = obj.getClass().getMethod(methodName);
            return m.invoke(obj);
        } catch (Exception e) {
            return null;
        }
    }

    private String safeInvokeString(Object obj, String methodName) {
        Object v = safeInvoke(obj, methodName);
        return v != null ? v.toString() : null;
    }
    
}
