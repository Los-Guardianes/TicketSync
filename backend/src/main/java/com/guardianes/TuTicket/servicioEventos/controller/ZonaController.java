package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.model.Zona;
import com.guardianes.TuTicket.servicioEventos.service.ZonaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ZonaController {

    @Autowired
    private ZonaService service;

    @PostMapping("/zona")
    public ResponseEntity<?> addZona(@RequestBody Zona zona) {
        try {
            Zona nueva = service.addZona(zona);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/zona")
    public ResponseEntity<List<Zona>> getAllZonas() {
        return ResponseEntity.ok(service.getAllZonas());
    }

    @GetMapping("/zona/{id}")
    public ResponseEntity<?> getZonaById(@PathVariable Integer id) {
        Zona zona = service.getZonaById(id);
        if (zona == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Zona no encontrada");
        }
        return ResponseEntity.ok(zona);
    }

    @PutMapping("/zona/{id}")
    public ResponseEntity<?> updateZona(@PathVariable Integer id, @RequestBody Zona zona) {
        try {
            zona.setIdZona(id);
            Zona actualizada = service.updateZona(zona);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/zona/{id}")
    public ResponseEntity<?> deleteZona(@PathVariable Integer id) {
        try {
            service.deleteZona(id);
            return ResponseEntity.ok("Zona eliminada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @GetMapping("/zona/evento/{id_evento}")
    public ResponseEntity<?> getZonasByEvento(@PathVariable Integer id_evento) {
        try{
            return ResponseEntity.ok(service.getZonasByEventId(id_evento));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
