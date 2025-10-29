package com.cbtaweb.spring.app1.spring_applicattions_cbta.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.cbtaweb.spring.app1.spring_applicattions_cbta.models.Aspirante;
import com.cbtaweb.spring.app1.spring_applicattions_cbta.repository.AspiranteRepository;

@RestController
@RequestMapping("/api/aspirantes")
@CrossOrigin(origins = "*")

public class AspiranteController {
        private final AspiranteRepository aspiranteRepository;

    public AspiranteController(AspiranteRepository aspiranteRepository) {
        this.aspiranteRepository = aspiranteRepository;
    }
    @GetMapping
    public List<Aspirante> obtenerTodos() {
        return aspiranteRepository.findAll();
    }
}
