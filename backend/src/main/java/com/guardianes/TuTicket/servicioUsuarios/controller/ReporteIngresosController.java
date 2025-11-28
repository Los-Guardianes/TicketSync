package com.guardianes.TuTicket.servicioUsuarios.controller;


import com.guardianes.TuTicket.servicioUsuarios.reportes.ReporteIngresosService;
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

@RestController
@RequestMapping("/api")
public class ReporteIngresosController {

    @Autowired
    private ReporteIngresosService reporteIngresosService;

    @GetMapping("/ingresos/reporte/excel")
    public ResponseEntity<InputStreamResource> descargarReporteIngresos() throws IOException {

        //Ejecuta el query y genera el excel
        ByteArrayInputStream excelStream = reporteIngresosService.generarExcelIngresos();

        //Definimos el nombre del archivo
        String nombreArchivo = "reporte_ingresos_comisiones.xlsx";

        //Preparamos los Headers
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + nombreArchivo);

        //Retornamos la respuesta
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(excelStream));
    }
}