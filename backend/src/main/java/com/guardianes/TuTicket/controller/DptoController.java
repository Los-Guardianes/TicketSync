package com.guardianes.TuTicket.controller;

import com.guardianes.TuTicket.model.Departamento;
import com.guardianes.TuTicket.service.DptoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DptoController {

    @Autowired
    private DptoService service;

    @PostMapping("/dpto")
    public ResponseEntity<?> addDepartamento(@RequestBody Departamento departamento) {
        try {
            Departamento nuevo = service.addDepartamento(departamento);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/dpto")
    public ResponseEntity<List<Departamento>> getAllDepartamentos() {
        List<Departamento> departamentos = service.getAllDepartamentos();
        return new ResponseEntity<>(departamentos, HttpStatus.OK);
    }

    @GetMapping("/dpto/{id}")
    public ResponseEntity<?> getDepartamentoById(@PathVariable Integer id) {
        Departamento departamento = service.getDepartamentoById(id);
        if (departamento == null) {
            return new ResponseEntity<>("Departamento no encontrado", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(departamento, HttpStatus.OK);
    }

    @PutMapping("/dpto/{id}")
    public ResponseEntity<?> updateDepartamento(@PathVariable Integer id, @RequestBody Departamento departamento) {
        try {
            departamento.setIdDepartamento(id);
            Departamento actualizado = service.updateDepartamento(departamento);
            return new ResponseEntity<>(actualizado, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/dpto/{id}")
    public ResponseEntity<?> deleteDepartamento(@PathVariable Integer id) {
        try {
            service.deleteDepartamento(id);
            return new ResponseEntity<>("Departamento eliminado", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
