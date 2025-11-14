package com.guardianes.TuTicket.servicioUsuarios.controller;

import com.guardianes.TuTicket.servicioUsuarios.model.ParametrosGlobales;
import com.guardianes.TuTicket.servicioUsuarios.service.ParametrosGlobalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ParametrosGlobalesController {

    private final ParametrosGlobalesService service;

    @GetMapping("/params")
    public ResponseEntity<List<ParametrosGlobales>> getAllParams() {
        return ResponseEntity.ok(service.getAllParametrosGlobales());
    }

    @GetMapping("/params/{id}")
    public ResponseEntity<?> getParamsById(@PathVariable Integer id) {
        ParametrosGlobales parametros = service.getParametrosGlobalesById(id);
        if (parametros == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Parámetros no encontrados");
        }
        return ResponseEntity.ok(parametros);
    }

    @PutMapping("/params/{id}")
    public ResponseEntity<?> actualizarParametros(@PathVariable Integer id, @RequestBody ParametrosGlobales parametros) {
        try {
            parametros.setIdParametro(id);
            ParametrosGlobales actualizado = service.updateParametrosGlobales(parametros);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}