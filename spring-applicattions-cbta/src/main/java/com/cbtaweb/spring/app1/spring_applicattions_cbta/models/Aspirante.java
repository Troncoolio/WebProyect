package com.cbtaweb.spring.app1.spring_applicattions_cbta.models;
import jakarta.persistence.*;
@Entity
@Table(name = "aspirantes")
public class Aspirante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;  
    private String apellidos;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getApellido() {
        return apellidos;
    }
    public void setApellido(String apellidos) {
        this.apellidos = apellidos;
    }
}
