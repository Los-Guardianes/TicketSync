package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.DTO.EventoDTO;
import com.guardianes.TuTicket.servicioEventos.DTO.in.EventoCompletoDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.repo.EventoRepo;
import com.guardianes.TuTicket.servicioEventos.service.EventoCompletoService;
import com.guardianes.TuTicket.servicioEventos.service.EventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioEventos.repo.FuncionRepo;
import com.guardianes.TuTicket.servicioEventos.service.FuncionService;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;




@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EventoController {

    private final EventoService service;

    @Autowired
    private FuncionRepo funcionRepo;

    @Autowired
    private EventoRepo eventoRepo;

    @Autowired
    private FuncionService funcionService;

    @PostMapping("/evento")
    public ResponseEntity<?> addEvento(@RequestBody Evento evento) {
        try {
            Evento nuevo = service.addEvento(evento);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public static class OrganizerEventResp {
        public Integer idEvento;
        public String nombre;
        public String direccion;
        public String urlImagen;

        // Fecha “representativa” opcional (futura más cercana o última pasada)
        public LocalDate fechaReferencia;
        // true si todas sus funciones quedaron en el pasado (event-level)
        public boolean esPasado;

        // TODAS las funciones activas para que el frontend liste cada una
        public List<FuncionItem> funciones;

        public static class FuncionItem {
            public Integer idFuncion;
            public LocalDate fechaInicio;
            public LocalDate fechaFin;
            public String horaInicio;
            public String horaFin;
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
        try {
            var hoy = LocalDate.now();

            var eventos = eventoRepo.findByOrganizador_IdUsuario(idUsuario);


            var respuesta = eventos.stream().map(ev -> {
                var funcionesActivas = funcionService.getFuncionByEvento(ev.getIdEvento())
                        .stream()
                        .filter(f -> Boolean.TRUE.equals(f.getActivo()))
                        .collect(Collectors.toList());

                boolean anyFutura = funcionesActivas.stream()
                        .anyMatch(f -> !f.getFechaInicio().isBefore(hoy));

                LocalDate fechaRef = funcionesActivas.stream()
                        .map(Funcion::getFechaInicio)
                        .filter(d -> anyFutura ? !d.isBefore(hoy) : d.isBefore(hoy))
                        .min(anyFutura ? Comparator.naturalOrder() : Comparator.reverseOrder())
                        .orElse(null);

                var out = new OrganizerEventResp();
                out.idEvento = ev.getIdEvento();
                out.nombre = ev.getNombre();
                out.direccion = ev.getDireccion();
                out.urlImagen = ev.getUrlImagen();
                out.fechaReferencia = fechaRef;
                out.esPasado = !anyFutura;

                out.funciones = funcionesActivas.stream().map(f -> {
                    var it = new OrganizerEventResp.FuncionItem();
                    it.idFuncion = f.getIdFuncion();
                    it.fechaInicio = f.getFechaInicio();
                    it.fechaFin = f.getFechaFin();
                    it.horaInicio = f.getHoraInicio() != null ? f.getHoraInicio().toString() : null;
                    it.horaFin = f.getHoraFin() != null ? f.getHoraFin().toString() : null;
                    return it;
                }).collect(Collectors.toList());

                return out;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
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