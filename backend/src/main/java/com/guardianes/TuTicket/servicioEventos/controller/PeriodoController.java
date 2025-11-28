package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.model.Periodo;
import com.guardianes.TuTicket.servicioEventos.service.PeriodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PeriodoController {

    private final PeriodoService service;

    @PostMapping("/periodo")
    public ResponseEntity<?> addPeriodo(@RequestBody Periodo periodo) {
        try {
            Periodo nueva = service.addPeriodo(periodo);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<Periodo>> getAllPeriodos() {
        return ResponseEntity.ok(service.getAllPeriodos());
    }

    @GetMapping("/periodo/{id}")
    public ResponseEntity<?> getPeriodoById(@PathVariable Integer id) {
        Periodo periodo = service.getPeriodoById(id);
        if (periodo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Periodo no encontrada");
        }
        return ResponseEntity.ok(periodo);
    }

    @PutMapping("/periodo/{id}")
    public ResponseEntity<?> updatePeriodo(@PathVariable Integer id, @RequestBody Periodo periodo) {
        try {
            periodo.setIdPeriodo(id);
            Periodo actualizada = service.updatePeriodo(periodo);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/periodo/{id}")
    public ResponseEntity<?> deletePeriodo(@PathVariable Integer id) {
        try {
            service.deletePeriodo(id);
            return ResponseEntity.ok("Periodo eliminada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("periodo/evento/{id_evento}")
    public ResponseEntity<?> getPeriodosByEvent(@PathVariable Integer id_evento) {
        try{
            return ResponseEntity.ok(service.getPeriodoByEventId(id_evento));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }

}
