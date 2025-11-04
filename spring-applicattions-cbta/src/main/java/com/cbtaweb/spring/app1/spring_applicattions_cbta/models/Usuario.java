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
    
    @Column(name="alumno_id")
    private Integer alumnoId;

    @Column(name="maestro_id")
    private Integer maestroId;

    @Column(name="administrativo_id")
    private Integer administrativoId;

    @Column(name="aspirante_id")
    private Integer aspiranteId;

    public Integer getAlumnoId() {
        return alumnoId;
    }

    public void setAlumnoId(Integer alumnoId) {
        this.alumnoId = alumnoId;
    }

    public Integer getMaestroId() {
        return maestroId;
    }

    public void setMaestroId(Integer maestroId) {
        this.maestroId = maestroId;
    }

    public Integer getAdministrativoId() {
        return administrativoId;
    }

    public void setAdministrativoId(Integer administrativoId) {
        this.administrativoId = administrativoId;
    }

    public Integer getAspiranteId() {
        return aspiranteId;
    }

    public void setAspiranteId(Integer aspiranteId) {
        this.aspiranteId = aspiranteId;
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
