package com.cbtaweb.spring.app1.spring_applicattions_cbta.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cbtaweb.spring.app1.spring_applicattions_cbta.models.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByAlumnoId(Integer alumno_id);
}
