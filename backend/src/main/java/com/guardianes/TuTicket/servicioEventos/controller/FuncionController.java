package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioEventos.service.FuncionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FuncionController {

    @Autowired
    private FuncionService service;

    @PostMapping("/funcion")
    public ResponseEntity<?> addFuncion(@RequestBody Funcion funcion) {
        try {
            Funcion nuevo = service.addFuncion(funcion);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/funcion")
    public ResponseEntity<List<Funcion>> getAllFunciones() {
        return ResponseEntity.ok(service.getAllFunciones());
    }

    @GetMapping("/funcion/{id}")
    public ResponseEntity<?> getFuncionById(@PathVariable Integer id) {
        Funcion funcion = service.getFuncionById(id);
        if (funcion == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Función no encontrada");
        }
        return ResponseEntity.ok(funcion);
    }

    @PutMapping("/funcion/{id}")
    public ResponseEntity<?> updateFuncion(@PathVariable Integer id, @RequestBody Funcion funcion) {
        try {
            funcion.setIdFuncion(id);
            Funcion actualizado = service.updateFuncion(funcion);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/funcion/{id}")
    public ResponseEntity<?> deleteFuncion(@PathVariable Integer id) {
        try {
            service.deleteFuncion(id);
            return ResponseEntity.ok("Función eliminada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
