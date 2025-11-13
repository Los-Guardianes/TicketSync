package com.guardianes.TuTicket.servicioUsuarios.controller;

import com.guardianes.TuTicket.servicioUsuarios.DTO.in.ClienteRegDTO;
import com.guardianes.TuTicket.servicioUsuarios.DTO.in.OrganizadorRegDTO;
import com.guardianes.TuTicket.servicioUsuarios.model.Organizador;
import com.guardianes.TuTicket.servicioUsuarios.service.OrganizadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrganizadorController {

    @Autowired
    private OrganizadorService service;

    @PostMapping("/organizador")
    public ResponseEntity<?> createOrganizador(@RequestBody Organizador organizador) {
        try {
            Organizador nuevo = service.addOrganizador(organizador);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/organizador")
    public ResponseEntity<List<Organizador>> getAllOrganizadores() {
        return ResponseEntity.ok(service.getAllOrganizadores());
    }

    @GetMapping("/organizador/{id}")
    public ResponseEntity<?> getOrganizadorById(@PathVariable Integer id) {
        Organizador organizador = service.getOrganizadorById(id);
        if (organizador == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organizador no encontrado");
        }
        return ResponseEntity.ok(organizador);
    }

    @PutMapping("/organizador/{id}")
    public ResponseEntity<?> updateOrganizador(@PathVariable Integer id, @RequestBody Organizador organizador) {
        try {
            organizador.setIdUsuario(id);
            Organizador actualizado = service.updateOrganizador(organizador);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/organizador/{id}")
    public ResponseEntity<?> deleteOrganizador(@PathVariable Integer id) {
        try {
            service.deleteOrganizador(id);
            return ResponseEntity.ok("Organizador eliminado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/organizador/register")
    public ResponseEntity<?> register(@RequestBody OrganizadorRegDTO organizador) {
        return ResponseEntity.ok(service.agregarOrganizador(organizador));
    }
}
