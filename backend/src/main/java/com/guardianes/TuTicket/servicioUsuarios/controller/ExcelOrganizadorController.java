package com.guardianes.TuTicket.servicioUsuarios.controller;

import com.guardianes.TuTicket.servicioUsuarios.model.Organizador;
import com.guardianes.TuTicket.servicioUsuarios.reportes.ReporteOrganizadorService;
import com.guardianes.TuTicket.servicioUsuarios.service.OrganizadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ExcelOrganizadorController {
    @Autowired
    private OrganizadorService orgService;
    @Autowired
    private ReporteOrganizadorService reporteService;

    @GetMapping("/organizador/reporte/excel")
    public ResponseEntity<InputStreamResource> descargarReporteExcel() throws IOException {

        // 1. Obtener los datos (usando tu servicio existente)
        List<Organizador> organizadores = orgService.getAllOrganizadores();

        // 2. Generar el Excel en memoria usando el nuevo servicio
        ByteArrayInputStream excelStream = reporteService.generarExcelOrganizadores(organizadores);

        // 3. Preparar los Headers de la respuesta HTTP
        HttpHeaders headers = new HttpHeaders();
        // Este header le dice al navegador que debe "descargar" el archivo
        headers.add("Content-Disposition", "attachment; filename=reporte_organizadores.xlsx");

        // 4. Construir y devolver la ResponseEntity
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(excelStream));
    }
}
