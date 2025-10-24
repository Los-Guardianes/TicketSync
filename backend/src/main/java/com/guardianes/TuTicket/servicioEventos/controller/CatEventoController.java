package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.model.CategoriaEvento;
import com.guardianes.TuTicket.servicioEventos.service.CatEventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CatEventoController {

    private final CatEventoService service;

    @PostMapping("/catevento")
    public ResponseEntity<?> addCatEvento(@RequestBody CategoriaEvento categoriaEvento) {
        try {
            CategoriaEvento nuevo = service.addCategoria(categoriaEvento);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/catevento")
    public ResponseEntity<List<CategoriaEvento>> getAllCatEventos() {
        return ResponseEntity.ok(service.getAllCategorias());
    }

    @GetMapping("/catevento/{id}")
    public ResponseEntity<?> getCatEventoById(@PathVariable Integer id) {
        CategoriaEvento categoriaEvento = service.getCategoriaById(id);
        if (categoriaEvento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Categoría de evento no encontrada");
        }
        return ResponseEntity.ok(categoriaEvento);
    }

    @PutMapping("/catevento/{id}")
    public ResponseEntity<?> updateCatEvento(@PathVariable Integer id, @RequestBody CategoriaEvento categoriaEvento) {
        try {
            categoriaEvento.setIdCategoria(id);
            CategoriaEvento actualizado = service.updateCategoria(categoriaEvento);
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
