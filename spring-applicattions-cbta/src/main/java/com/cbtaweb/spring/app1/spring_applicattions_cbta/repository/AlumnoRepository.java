package com.cbtaweb.spring.app1.spring_applicattions_cbta.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cbtaweb.spring.app1.spring_applicattions_cbta.models.Alumno;

public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    Optional<Alumno> findByNcontrol(String ncontrol);
}
