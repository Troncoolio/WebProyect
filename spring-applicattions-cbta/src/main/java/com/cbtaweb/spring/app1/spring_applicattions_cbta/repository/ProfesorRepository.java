package com.cbtaweb.spring.app1.spring_applicattions_cbta.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cbtaweb.spring.app1.spring_applicattions_cbta.models.Profesor;

public interface ProfesorRepository extends JpaRepository<Profesor, Integer> {
    @Override
    default Optional<Profesor> findById(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }
    @Override
    default <S extends Profesor> S save(S entity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }
    @Override
    default void deleteById(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteById'");
    }
    
}
