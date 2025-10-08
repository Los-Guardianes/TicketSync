package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.model.Temporada;
import com.guardianes.TuTicket.servicioEventos.service.TemporadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TemporadaController {

    @Autowired
    private TemporadaService service;

    @PostMapping("/temporada")
    public ResponseEntity<?> addTemporada(@RequestBody Temporada temporada) {
        try {
            Temporada nueva = service.addTemporada(temporada);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/temporada")
    public ResponseEntity<List<Temporada>> getAllTemporadas() {
        return ResponseEntity.ok(service.getAllTemporadas());
    }

    @GetMapping("/temporada/{id}")
    public ResponseEntity<?> getTemporadaById(@PathVariable Integer id) {
        Temporada temporada = service.getTemporadaById(id);
        if (temporada == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Temporada no encontrada");
        }
        return ResponseEntity.ok(temporada);
    }

    @PutMapping("/temporada/{id}")
    public ResponseEntity<?> updateTemporada(@PathVariable Integer id, @RequestBody Temporada temporada) {
        try {
            temporada.setIdTemporada(id);
            Temporada actualizada = service.updateTemporada(temporada);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/temporada/{id}")
    public ResponseEntity<?> deleteTemporada(@PathVariable Integer id) {
        try {
            service.deleteTemporada(id);
            return ResponseEntity.ok("Temporada eliminada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("temporada/evento/{id_evento}")
    public ResponseEntity<?> getTemporadasByEvent(@PathVariable Integer id_evento) {
        try{
            return ResponseEntity.ok(service.getTemporadasByEventId(id_evento));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
