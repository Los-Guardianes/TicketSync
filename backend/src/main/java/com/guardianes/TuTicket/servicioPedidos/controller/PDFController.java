package com.guardianes.TuTicket.servicioPedidos.controller;

import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import com.guardianes.TuTicket.servicioPedidos.service.OrdenCompraService;
import com.guardianes.TuTicket.servicioPedidos.service.PDFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PDFController {

    @Autowired
    private PDFService service;

    @Autowired
    private OrdenCompraService ordenService;

    @GetMapping("/comp/{id}")
    public ResponseEntity<byte[]> descargarComprobante(@PathVariable Integer id) throws Exception {
        OrdenCompra orden = ordenService.getOrdenById(id);
        byte[] pdfBytes = service.generarComprobantePDF(orden);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "comprobante_" + id + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/miticket/{id}")
    public ResponseEntity<byte[]> descargarTicket(@PathVariable String id) throws Exception {
        byte[] pdfBytes = service.generarTicketPDF(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "ticket_" + id + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
