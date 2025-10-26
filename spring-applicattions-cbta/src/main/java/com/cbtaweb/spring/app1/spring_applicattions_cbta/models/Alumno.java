package com.cbtaweb.spring.app1.spring_applicattions_cbta.models;
import jakarta.persistence.*;

@Entity
@Table(name = "alumnos")
public class Alumno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nControl;

    private String nombre;
    private String grupo;
    private String carrera;
    private String materia;
    private String calificacion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getnControl() { return nControl; }
    public void setnControl(String nControl) { this.nControl = nControl; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getGrupo() { return grupo; }
    public void setGrupo(String grupo) { this.grupo = grupo; }

    public String getCarrera() { return carrera; }
    public void setCarrera(String carrera) { this.carrera = carrera; }

    public String getMateria() { return materia;}
    public void setMateria(String materia) { this.materia = materia;}
    
    public String getCalificacion() { return calificacion; }
    public void setCalificacion(String calificacion) { this.calificacion = calificacion; }
}