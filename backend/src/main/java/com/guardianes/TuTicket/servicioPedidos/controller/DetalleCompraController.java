package com.guardianes.TuTicket.servicioPedidos.controller;

import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import com.guardianes.TuTicket.servicioPedidos.service.DetalleCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DetalleCompraController {

    @Autowired
    private DetalleCompraService service;

    @PostMapping("/detallecompra")
    public ResponseEntity<?> addDetalleCompra(@RequestBody DetalleCompra detalle) {
        try {
            DetalleCompra nuevo = service.addDetalleCompra(detalle);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/detallecompra")
    public ResponseEntity<List<DetalleCompra>> getAllDetalles() {
        return ResponseEntity.ok(service.getAllDetalles());
    }

    @GetMapping("/detallecompra/{id}")
    public ResponseEntity<?> getDetalleById(@PathVariable Integer id) {
        DetalleCompra detalle = service.getDetalleById(id);
        if (detalle == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Detalle de compra no encontrado");
        }
        return ResponseEntity.ok(detalle);
    }

    @PutMapping("/detallecompra/{id}")
    public ResponseEntity<?> updateDetalle(@PathVariable Integer id, @RequestBody DetalleCompra detalle) {
        try {
            detalle.setIdDetalleCompra(id);
            DetalleCompra actualizado = service.updateDetalleCompra(detalle);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/detallecompra/{id}")
    public ResponseEntity<?> deleteDetalle(@PathVariable Integer id) {
        try {
            service.deleteDetalleCompra(id);
            return ResponseEntity.ok("Detalle de compra eliminado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
