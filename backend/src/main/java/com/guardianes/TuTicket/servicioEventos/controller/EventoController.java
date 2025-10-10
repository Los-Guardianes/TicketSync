package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.DTO.EventoCompletoDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.service.EventoCompletoService;
import com.guardianes.TuTicket.servicioEventos.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class EventoController {

    @Autowired
    private EventoService service;

    @PostMapping("/evento")
    public ResponseEntity<?> addEvento(@RequestBody Evento evento) {
        try {
            Evento nuevo = service.addEvento(evento);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/evento")
    public ResponseEntity<List<Evento>> getAllEventos() {
        return ResponseEntity.ok(service.getAllEventos());
    }

    @GetMapping("/evento/{id}")
    public ResponseEntity<?> getEventoById(@PathVariable Integer id) {
        Evento evento = service.getEventoById(id);
        if (evento == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Evento no encontrado");
        }
        return ResponseEntity.ok(evento);
    }

    @PutMapping("/evento/{id}")
    public ResponseEntity<?> updateEvento(@PathVariable Integer id, @RequestBody Evento evento) {
        try {
            evento.setIdEvento(id);
            Evento actualizado = service.updateEvento(evento);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/evento/{id}")
    public ResponseEntity<?> deleteEvento(@PathVariable Integer id) {
        try {
            service.deleteEvento(id);
            return ResponseEntity.ok("Evento eliminado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // Experimento, funcionará?
    @Autowired
    private EventoCompletoService eventoCompletoService; //Nuevo servicio

    @PostMapping("/evento/completo")
    public ResponseEntity<?> addEventoCompleto(@RequestBody EventoCompletoDTO eventoCompletoDTO) {
        try {
            Evento nuevoEvento = eventoCompletoService.crearEventoCompleto(eventoCompletoDTO);
            return new ResponseEntity<>(nuevoEvento, HttpStatus.CREATED);
        } catch (Exception e) {
            // Es bueno loggear el error para depuración
            // logger.error("Error al crear evento completo: ", e);
            return new ResponseEntity<>("Error en el servidor: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}