package com.guardianes.TuTicket.servicioUbicacion.controller;

import com.guardianes.TuTicket.servicioUbicacion.model.Dpto;
import com.guardianes.TuTicket.servicioUbicacion.service.DptoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class DptoController {

    @Autowired
    private DptoService service;

    @PostMapping("/dpto")
    public ResponseEntity<?> addDpto(@RequestBody Dpto dpto) {
        try {
            Dpto nuevo = service.addDpto(dpto);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/dpto")
    public ResponseEntity<List<Dpto>> getAllDptos() {
        List<Dpto> dptos = service.getAllDptos();
        return new ResponseEntity<>(dptos, HttpStatus.OK);
    }

    @GetMapping("/dpto/{id}")
    public ResponseEntity<?> getDptoById(@PathVariable Integer id) {
        Dpto dpto = service.getDptoById(id);
        if (dpto == null) {
            return new ResponseEntity<>("Departamento no encontrado", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(dpto, HttpStatus.OK);
    }

    @PutMapping("/dpto/{id}")
    public ResponseEntity<?> updateDpto(@PathVariable Integer id, @RequestBody Dpto dpto) {
        try {
            dpto.setIdDpto(id);
            Dpto actualizado = service.updateDpto(dpto);
            return new ResponseEntity<>(actualizado, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/dpto/{id}")
    public ResponseEntity<?> deleteDpto(@PathVariable Integer id) {
        try {
            service.deleteDpto(id);
            return new ResponseEntity<>("Departamento eliminado", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
