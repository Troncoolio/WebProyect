package com.cbtaweb.spring.app1.spring_applicattions_cbta.models;

import jakarta.persistence.Entity;
import jakarta.persistence.*;

@Entity
@Table(name = "administrativos")
public class Administrativos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String puesto;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getPuesto() {
        return puesto;
    }
    public void setPuesto(String puesto) {
        this.puesto = puesto;
    }

    
}
