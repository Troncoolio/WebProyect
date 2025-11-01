package com.cbtaweb.spring.app1.spring_applicattions_cbta.auth;

public class LoginRequest {
    private String ncontrol;
    private String password;

    // Constructor vacío (necesario para @RequestBody)
    public LoginRequest() {
    }

    // Constructor opcional (útil para pruebas)
    public LoginRequest(String ncontrol, String password) {
        this.ncontrol = ncontrol;
        this.password = password;
    }

    // Getters y Setters
    public String getNcontrol() {
        return ncontrol;
    }

    public void setNcontrol(String ncontrol) {
        this.ncontrol = ncontrol;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

