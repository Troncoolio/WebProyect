package com.cbtaweb.spring.app1.spring_applicattions_cbta.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cbtaweb.spring.app1.spring_applicattions_cbta.models.Materia;
public interface MateriaRepository extends JpaRepository<Materia, Long> {
    @Override
    default List<Materia> findAll() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    }
    @Override
    default Optional<Materia> findById(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }
    @Override
    default void deleteById(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteById'");
    }
    @Override
    default <S extends Materia> S save(S entity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }
    @Override
    default void deleteAllById(Iterable<? extends Long> ids) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteAllById'");
    }
}
