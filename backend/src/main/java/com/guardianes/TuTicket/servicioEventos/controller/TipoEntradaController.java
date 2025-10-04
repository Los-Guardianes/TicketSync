package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.model.TipoEntrada;
import com.guardianes.TuTicket.servicioEventos.service.TipoEntradaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TipoEntradaController {

    @Autowired
    private TipoEntradaService service;

    @PostMapping("/tipoentrada")
    public ResponseEntity<?> addTipoEntrada(@RequestBody TipoEntrada tipoEntrada) {
        try {
            TipoEntrada nuevo = service.addTipoEntrada(tipoEntrada);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/tipoentrada")
    public ResponseEntity<List<TipoEntrada>> getAllTipoEntradas() {
        return ResponseEntity.ok(service.getAllTipoEntradas());
    }

    @GetMapping("/tipoentrada/{id}")
    public ResponseEntity<?> getTipoEntradaById(@PathVariable Integer id) {
        TipoEntrada tipoEntrada = service.getTipoEntradaById(id);
        if (tipoEntrada == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tipo de entrada no encontrado");
        }
        return ResponseEntity.ok(tipoEntrada);
    }

    @PutMapping("/tipoentrada/{id}")
    public ResponseEntity<?> updateTipoEntrada(@PathVariable Integer id, @RequestBody TipoEntrada tipoEntrada) {
        try {
            tipoEntrada.setIdTipoEntrada(id);
            TipoEntrada actualizado = service.updateTipoEntrada(tipoEntrada);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/tipoentrada/{id}")
    public ResponseEntity<?> deleteTipoEntrada(@PathVariable Integer id) {
        try {
            service.deleteTipoEntrada(id);
            return ResponseEntity.ok("Tipo de entrada eliminado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
