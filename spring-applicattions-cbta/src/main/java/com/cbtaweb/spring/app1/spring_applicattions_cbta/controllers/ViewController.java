package com.cbtaweb.spring.app1.spring_applicattions_cbta.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping({"/", "/index", "/login"})
    public String index() {
        return "index";
    }

    @GetMapping("/aspirantes")
    public String aspirantes() {
        return "aspirantes";
    }

    @GetMapping("/estudiantes")
    public String estudiantes() {
        return "estudiantes";
    }

    @GetMapping("/personal")
    public String personal() {
        return "personal";
    }

    @GetMapping("/portal")
    public String mostrarPortal() {
        return "portal";
    } 
}
