package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO.EventoDTO;
import com.guardianes.TuTicket.servicioEventos.DTO.in.EventoCompletoDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.service.EventoCompletoService;
import com.guardianes.TuTicket.servicioEventos.service.EventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.guardianes.TuTicket.servicioEventos.service.FuncionService;
import java.util.List;




@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EventoController {

    private final EventoService service;
    private final FuncionService funcionService;

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
    public ResponseEntity<List<EventoDTO>> getAllEventos() {
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

    @GetMapping("/evento/organizer/{idUsuario}")
    public ResponseEntity<?> listarEventosDelOrganizador(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(service.getEventoDTOByIOrganizador(idUsuario));
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

    @PutMapping("/evento/{idEvento}/cancelar")
    public ResponseEntity<?> cancelarEvento(@PathVariable Integer idEvento) {
        try {
            Evento evento = service.getEventoById(idEvento);
            if (evento == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Evento no encontrado");
            }

            // marcar como inactivo
            evento.setActivo(false);

            // guardar
            Evento actualizado = service.updateEvento(evento);

            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }


}