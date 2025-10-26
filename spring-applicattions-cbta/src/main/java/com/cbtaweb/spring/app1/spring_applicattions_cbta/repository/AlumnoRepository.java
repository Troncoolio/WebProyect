package com.cbtaweb.spring.app1.spring_applicattions_cbta.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cbtaweb.spring.app1.spring_applicattions_cbta.models.Alumno;

public interface AlumnoRepository extends JpaRepository<Alumno, Long> { 
    @Override
    default List<Alumno> findAll() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    }
    @Override
    default Optional<Alumno> findById(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }
    @Override
    default void delete(Alumno entity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }
    @Override
    default <S extends Alumno> S save(S entity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }
    
    
}
