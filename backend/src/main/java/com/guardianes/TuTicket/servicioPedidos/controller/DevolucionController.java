package com.guardianes.TuTicket.servicioPedidos.controller;

import com.guardianes.TuTicket.servicioPedidos.model.Devolucion;
import com.guardianes.TuTicket.servicioPedidos.service.DevolucionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DevolucionController {

    @Autowired
    private DevolucionService service;

    @PostMapping("/devolucion")
    public ResponseEntity<?> addDevolucion(@RequestBody Devolucion devolucion) {
        try {
            Devolucion nueva = service.addDevolucion(devolucion);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/devolucion")
    public ResponseEntity<List<Devolucion>> getAllDevoluciones() {
        return ResponseEntity.ok(service.getAllDevoluciones());
    }

    @GetMapping("/devolucion/{id}")
    public ResponseEntity<?> getDevolucionById(@PathVariable Integer id) {
        Devolucion devolucion = service.getDevolucionById(id);
        if (devolucion == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Devolución no encontrada");
        }
        return ResponseEntity.ok(devolucion);
    }

    @PutMapping("/devolucion/{id}")
    public ResponseEntity<?> updateDevolucion(@PathVariable Integer id, @RequestBody Devolucion devolucion) {
        try {
            devolucion.setIdDevolucion(id);
            Devolucion actualizada = service.updateDevolucion(devolucion);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/devolucion/{id}")
    public ResponseEntity<?> deleteDevolucion(@PathVariable Integer id) {
        try {
            service.deleteDevolucion(id);
            return ResponseEntity.ok("Devolución eliminada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
