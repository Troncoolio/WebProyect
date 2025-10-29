package com.cbtaweb.spring.app1.spring_applicattions_cbta.models;

import jakarta.persistence.*;

@Entity
@Table(name="usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String username;
    private String password;
    private String rol;

    private Integer alumno_id;
    private Integer maestro_id;
    private Integer administrativo_id;
    private Integer aspirante_id;
    
    public Integer getAlumno_id() {
        return alumno_id;
    }

    public void setAlumno_id(Integer alumno_id) {
        this.alumno_id = alumno_id;
    }

    public Integer getMaestro_id() {
        return maestro_id;
    }

    public void setMaestro_id(Integer maestro_id) {
        this.maestro_id = maestro_id;
    }

    public Integer getAdministrativo_id() {
        return administrativo_id;
    }

    public void setAdministrativo_id(Integer administrativo_id) {
        this.administrativo_id = administrativo_id;
    }

    public Integer getAspirante_id() {
        return aspirante_id;
    }

    public void setAspirante_id(Integer aspirante_id) {
        this.aspirante_id = aspirante_id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
