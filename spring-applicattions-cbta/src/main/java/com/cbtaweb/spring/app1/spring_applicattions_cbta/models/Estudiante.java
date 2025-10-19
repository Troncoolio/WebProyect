package com.cbtaweb.spring.app1.spring_applicattions_cbta.models;

public class Estudiante {
    private int nControl;
    private String nombre;
    private String apellidos;
    private String carrera;

    public Estudiante(int nControl, String nombre, String apellidos, String carrera) {
        this.nControl = nControl;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.carrera = carrera;
    }
    public int getnControl() {
        return nControl;
    }
    public void setnControl(int nControl) {
        this.nControl = nControl;
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
    public String getCarrera() {
        return carrera;
    }
    public void setCarrera(String carrera) {
        this.carrera = carrera;
    }
    
}
