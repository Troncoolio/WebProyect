package com.cbtaweb.spring.app1.spring_applicattions_cbta.models;

import java.util.List;

import jakarta.persistence.*;
@Entity
@Table(name = "profesores")
public class Profesor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;
    private String apellidos;
    private List<String> materias;

    public Profesor(int id, String nombre, String apellidos, List<String> materias) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.materias = materias;
    }
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
    public List<String> getMaterias() {
        return materias;
    }
    public void agregarMateria(String materia) {
        materias.add(materia);
    }
}
