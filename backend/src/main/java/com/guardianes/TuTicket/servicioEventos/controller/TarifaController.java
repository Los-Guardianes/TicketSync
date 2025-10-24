package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.service.TarifaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TarifaController {

    private final TarifaService tarifaService;

    /*
    @PutMapping("/tarifa/{id}")
    public ResponseEntity<?> updateTarifa(@PathVariable Integer id, @RequestBody TarifaDTO tarifaDTO) {
        try {
            tarifaDTO.setIdTarifa(id);
            Periodo actualizada = tarifaService.updatePeriodo(tarifaDTO);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/periodo/{id}")
    public ResponseEntity<?> deletePeriodo(@PathVariable Integer id) {
        try {
            service.deletePeriodo(id);
            return ResponseEntity.ok("Periodo eliminada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
     */
    @GetMapping("/tarifa/evento/{idEvento}")
    public ResponseEntity<?> getTarifasByEvento(@PathVariable Integer idEvento) {
        try{
            return ResponseEntity.ok(tarifaService.getTarifasByEvento(idEvento));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
}
