package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO.ZonaXFuncionDTO;
import com.guardianes.TuTicket.servicioEventos.service.ZonaService;
import com.guardianes.TuTicket.servicioEventos.service.ZonaXFuncionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ZonaxFuncionController {
    private final ZonaXFuncionService  zonaXFuncionService;

    @GetMapping("/zonaxfuncion/evento/{idEvento}")
    public ResponseEntity<List<ZonaXFuncionDTO>> getZonaFuncionEvento(@PathVariable("idEvento") Integer idEvento){
        return ResponseEntity.ok(zonaXFuncionService.getZonaXFuncionByEvento(idEvento));
    }
}
