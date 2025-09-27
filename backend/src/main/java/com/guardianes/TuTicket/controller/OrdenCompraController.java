package com.guardianes.TuTicket.controller;

import com.guardianes.TuTicket.model.OrdenCompra;
import com.guardianes.TuTicket.model.Usuario;
import com.guardianes.TuTicket.service.OrdenCompraService;
import com.guardianes.TuTicket.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrdenCompraController {

    @Autowired
    private OrdenCompraService service;

    @Autowired
    private UsuarioService usuarioService;


    @PostMapping("/orden")
    public ResponseEntity<?> addOrden(@RequestBody OrdenCompra orden) {
        try {
            Integer idUsuario = orden.getUsuario().getIdUsuario();
            Usuario usuario = usuarioService.getUsuarioById(idUsuario);
            if (usuario == null) {
                return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
            }
            orden.setUsuario(usuario);
            OrdenCompra nueva = service.addOrden(orden);
            return new ResponseEntity<>(nueva, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/orden")
    public ResponseEntity<List<OrdenCompra>> getAllOrdenes() {
        return ResponseEntity.ok(service.getAllOrdenes());
    }

    @GetMapping("/orden/{id}")
    public ResponseEntity<?> getOrdenById(@PathVariable Integer id) {
        OrdenCompra orden = service.getOrdenById(id);
        if (orden == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Orden de compra no encontrada");
        }
        return ResponseEntity.ok(orden);
    }

    @PutMapping("/orden/{id}")
    public ResponseEntity<?> updateOrden(@PathVariable Integer id, @RequestBody OrdenCompra orden) {
        try {
            orden.setIdOrdenCompra(id);
            OrdenCompra actualizada = service.updateOrden(orden);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/orden/{id}")
    public ResponseEntity<?> deleteOrden(@PathVariable Integer id) {
        try {
            service.deleteOrden(id);
            return ResponseEntity.ok("Orden de compra eliminada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}