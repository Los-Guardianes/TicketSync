package com.guardianes.TuTicket.servicioPedidos.controller;

import com.guardianes.TuTicket.servicioPedidos.model.Ticket;
import com.guardianes.TuTicket.servicioPedidos.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.guardianes.TuTicket.servicioPedidos.DTO.TicketDTO;
import java.util.List;
    
@RestController
@RequestMapping("/api")
public class TicketController {

    @Autowired
    private TicketService service;

    @PostMapping("/ticket")
    public ResponseEntity<?> addTicket(@RequestBody Ticket ticket) {
        try {
            Ticket nuevo = service.addTicket(ticket);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/ticket")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(service.getAllTickets());
    }

    @GetMapping("/ticket/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Integer id) {
        Ticket ticket = service.getTicketById(id);
        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket no encontrado");
        }
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/ticket/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable Integer id, @RequestBody Ticket ticket) {
        try {
            ticket.setIdTicket(id);
            Ticket actualizado = service.updateTicket(ticket);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/ticket/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Integer id) {
        try {
            service.deleteTicket(id);
            return ResponseEntity.ok("Ticket eliminado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/ticket/user/{id}")
    public ResponseEntity<?> getTicketByIdUsuario(@PathVariable String id) {
        Integer myId = Integer.parseInt(id);
        List<Ticket> tickets = service.getTicketsByIdUsuario(myId);
        if (tickets == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error al conseguir lista");
        }
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/miticket/usuario/{idUsuario}/funcion/{idFuncion}")
    public ResponseEntity<List<TicketDTO>> getTicketsByUsuarioAndEvento(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idFuncion) {
        return ResponseEntity.ok(service.getTicketsDTOByUsuarioAndFuncion(idUsuario, idFuncion));
    }
    //Nuevo
    @GetMapping("/ticket/evento/{idEvento}")
    public ResponseEntity<List<TicketDTO>> getTicketsByEvento(@PathVariable Integer idEvento) {
        return ResponseEntity.ok(service.getTicketsDTOByEvento(idEvento));
    }


}
