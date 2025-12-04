package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO.TarifaDTO;
import com.guardianes.TuTicket.servicioEventos.model.Tarifa;
import com.guardianes.TuTicket.servicioEventos.service.TarifaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TarifaController {

    private final TarifaService tarifaService;

    @GetMapping("/tarifa/evento/{idEvento}")
    public ResponseEntity<?> getTarifasByEvento(@PathVariable Integer idEvento) {
        try {
            return ResponseEntity.ok(tarifaService.getTarifasByEvento(idEvento));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/tarifa")
    public ResponseEntity<?> createTarifa(@RequestBody TarifaDTO tarifaDTO) {
        try {
            Tarifa nueva = tarifaService.addTarifaFromDTO(tarifaDTO);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PutMapping("/tarifa/{id}")
    public ResponseEntity<?> updateTarifa(@PathVariable Integer id, @RequestBody TarifaDTO tarifaDTO) {
        try {
            tarifaDTO.setIdTarifa(id);
            Tarifa actualizada = tarifaService.updateTarifaFromDTO(tarifaDTO);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/tarifa/{id}")
    public ResponseEntity<?> deleteTarifa(@PathVariable Integer id) {
        try {
            tarifaService.deleteTarifa(id);
            return ResponseEntity.ok("Tarifa eliminada correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PatchMapping("/tarifa/{id}/toggle-activo")
    public ResponseEntity<?> toggleActivoTarifa(@PathVariable Integer id) {
        try {
            Tarifa tarifa = tarifaService.toggleActivo(id);
            return ResponseEntity.ok(tarifa);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
