package com.guardianes.TuTicket.servicioPedidos.controller;

import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import com.guardianes.TuTicket.servicioPedidos.service.OrdenCompraService;
import com.guardianes.TuTicket.servicioPedidos.service.PDFService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    
    @PostMapping("/miticket")
    public ResponseEntity<byte[]> descargarTicket(@RequestBody List<Integer> ids) throws Exception {
        byte[] pdfBytes = service.generarTicketPDF(ids);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "tickets.pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
