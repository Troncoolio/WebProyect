package com.cbtaweb.spring.app1.spring_applicattions_cbta.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cbtaweb.spring.app1.spring_applicattions_cbta.models.Profesor;

public interface ProfesorRepository extends JpaRepository<Profesor, Integer> {}

