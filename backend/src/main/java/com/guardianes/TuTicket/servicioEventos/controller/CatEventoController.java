package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.model.CatEvento;
import com.guardianes.TuTicket.servicioEventos.service.CatEventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatEventoController {

    @Autowired
    private CatEventoService service;

    @PostMapping("/catevento")
    public ResponseEntity<?> addCatEvento(@RequestBody CatEvento catEvento) {
        try {
            CatEvento nuevo = service.addCategoria(catEvento);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/catevento")
    public ResponseEntity<List<CatEvento>> getAllCatEventos() {
        return ResponseEntity.ok(service.getAllCategorias());
    }

    @GetMapping("/catevento/{id}")
    public ResponseEntity<?> getCatEventoById(@PathVariable Integer id) {
        CatEvento catEvento = service.getCategoriaById(id);
        if (catEvento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Categoría de evento no encontrada");
        }
        return ResponseEntity.ok(catEvento);
    }

    @PutMapping("/catevento/{id}")
    public ResponseEntity<?> updateCatEvento(@PathVariable Integer id, @RequestBody CatEvento catEvento) {
        try {
            catEvento.setIdCategoria(id);
            CatEvento actualizado = service.updateCategoria(catEvento);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/catevento/{id}")
    public ResponseEntity<?> deleteCatEvento(@PathVariable Integer id) {
        try {
            service.deleteCategoria(id);
            return ResponseEntity.ok("Categoría de evento eliminada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
