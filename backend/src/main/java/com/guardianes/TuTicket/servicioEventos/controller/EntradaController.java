package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.model.Entrada;
import com.guardianes.TuTicket.servicioEventos.service.EntradaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EntradaController {

    @Autowired
    private EntradaService service;

    @PostMapping("/entrada")
    public ResponseEntity<?> addEntrada(@RequestBody Entrada entrada) {
        try {
            Entrada nueva = service.addEntrada(entrada);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/entrada")
    public ResponseEntity<List<Entrada>> getAllEntradas() {
        return ResponseEntity.ok(service.getAllEntradas());
    }

    @GetMapping("/entrada/{id}")
    public ResponseEntity<?> getEntradaById(@PathVariable Integer id) {
        Entrada entrada = service.getEntradaById(id);
        if (entrada == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Entrada no encontrada");
        }
        return ResponseEntity.ok(entrada);
    }

    @PutMapping("/entrada/{id}")
    public ResponseEntity<?> updateEntrada(@PathVariable Integer id, @RequestBody Entrada entrada) {
        try {
            entrada.setIdEntrada(id);
            Entrada actualizada = service.updateEntrada(entrada);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/entrada/{id}")
    public ResponseEntity<?> deleteEntrada(@PathVariable Integer id) {
        try {
            service.deleteEntrada(id);
            return ResponseEntity.ok("Entrada eliminada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
