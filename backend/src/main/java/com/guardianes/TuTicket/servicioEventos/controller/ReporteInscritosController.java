package com.guardianes.TuTicket.servicioEventos.controller;

import com.guardianes.TuTicket.servicioPedidos.model.Ticket;
import com.guardianes.TuTicket.servicioPedidos.service.TicketService;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.reportes.ReporteInscritosService;
import com.guardianes.TuTicket.servicioEventos.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReporteInscritosController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private EventoService eventoService;

    @Autowired
    private ReporteInscritosService reporteService;

    @GetMapping("/evento/{idEvento}/inscritos/reporte/excel")
    public ResponseEntity<InputStreamResource> descargarReporteInscritos(@PathVariable Integer idEvento)
            throws IOException {

        // 1. Obtener los tickets del evento usando el método correcto del repo
        // Usando getTicketsDTOByEvento que internamente hace findByEvento
        List<Ticket> tickets = ticketService.getAllTickets().stream()
                .filter(t -> t.getDetalleCompra() != null
                        && t.getDetalleCompra().getOrdenCompra() != null
                        && t.getDetalleCompra().getOrdenCompra().getFuncion() != null
                        && t.getDetalleCompra().getOrdenCompra().getFuncion().getEvento() != null
                        && t.getDetalleCompra().getOrdenCompra().getFuncion().getEvento().getIdEvento()
                                .equals(idEvento))
                .toList();

        // 2. Obtener el nombre del evento
        Evento evento = eventoService.getEventoById(idEvento);
        String nombreEvento = evento != null ? evento.getNombre() : "Evento";

        // 3. Generar el Excel
        ByteArrayInputStream excelStream = reporteService.generarExcelInscritos(tickets, nombreEvento);

        // 4. Preparar headers
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition",
                "attachment; filename=inscritos_" + nombreEvento.replaceAll(" ", "_") + ".xlsx");

        // 5. Devolver respuesta
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(excelStream));
    }
}
