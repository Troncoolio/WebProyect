package com.cbtaweb.spring.app1.spring_applicattions_cbta.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cbtaweb.spring.app1.spring_applicattions_cbta.models.Alumno;

public interface AlumnoRepository extends JpaRepository<Alumno, Long> {}
