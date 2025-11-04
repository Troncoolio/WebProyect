package com.cbtaweb.spring.app1.spring_applicattions_cbta.auth;

public class LoginResponse {
    private String token;
    private String rol;
    private Long alumnoId;
    private String alumnoNombre;

    public LoginResponse(String token, String rol, Long alumnoId, String alumnoNombre) {
        this.token = token;
        this.rol = rol;
        this.alumnoId = alumnoId;
        this.alumnoNombre = alumnoNombre;
    }

    public String getToken() {
        return token;
    }

    public String getRol() {
        return rol;
    }

    public Long getAlumnoId() {
        return alumnoId;
    }

    public String getAlumnoNombre() {
        return alumnoNombre;
    }
}
