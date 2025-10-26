package com.cbtaweb.spring.app1.spring_applicattions_cbta.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cbtaweb.spring.app1.spring_applicattions_cbta.models.Aspirante;

public interface AspiranteRepository extends JpaRepository<Aspirante, Integer> {
    @Override
    default List<Aspirante> findAll() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    }
    @Override
    default Optional<Aspirante> findById(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }
    @Override
    default void deleteById(Integer id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteById'");
    }
    @Override
    default <S extends Aspirante> S save(S entity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }
}
