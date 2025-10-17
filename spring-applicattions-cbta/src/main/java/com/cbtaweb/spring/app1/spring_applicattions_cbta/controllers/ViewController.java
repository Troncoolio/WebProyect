package com.cbtaweb.spring.app1.spring_applicattions_cbta.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class ViewController {
    @GetMapping("/spring-applicattions-cbta/src/main/resources/templates")

    public String aspirantes() {
        return "aspirantes.html";
    }
    
}
