package com.guardianes.TuTicket.servicioPedidos.service;

import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import com.guardianes.TuTicket.servicioPedidos.repo.OrdenCompraRepo;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import com.guardianes.TuTicket.servicioUsuarios.repo.UsuarioRepo;
import com.guardianes.TuTicket.servicioUsuarios.service.UsuarioService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Date;
import java.util.Random;

@Service
public class PDFService {

    @Autowired
    private OrdenCompraRepo repo;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private DetalleCompraService dcService;

    public byte[] generarComprobantePDF(OrdenCompra orden) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Rectangle customSize = new Rectangle(400, 300);
        Document document = new Document(customSize);
        PdfWriter.getInstance(document, baos);
        document.open();

        Image logo = Image.getInstance("src/main/resources/TUTICKET_PNG_SIN_ESPACIOS.png");
        logo.scaleToFit(100, 100);
        logo.setAlignment(Image.ALIGN_CENTER);
        document.add(logo);

        Font tituloFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        int numero = new Random().nextInt(100000); // 0 a 99999
        String numeroFormateado = String.format("%05d", numero);
        Paragraph titulo = new Paragraph("Comprobante de pago — Nº " + numeroFormateado, tituloFont);
        titulo.setAlignment(Element.ALIGN_CENTER);
        document.add(titulo);
        document.add(new Paragraph(" ")); // espacio

        //Obtener atributos
        Usuario user = orden.getUsuario();
        List<DetalleCompra> detalles = dcService.getDetallesByOrdenCompra(orden.getIdOrdenCompra());

        int totalTickets = detalles.stream()
                .mapToInt(DetalleCompra::getCantidad)
                .sum();

        double total = detalles.stream()
                    .mapToDouble(detalle -> detalle.getEntrada().getPrecioCalculado().doubleValue() * detalle.getCantidad())
                    .sum();

        document.add(new Paragraph("Nombre y apellido del usuario: " + user.getNombre() + " " + user.getApellido()));
        document.add(new Paragraph("Total de entradas: " + totalTickets));
        document.add(new Paragraph("Precio total: S/ " + total));

        // Fecha al final, alineada a la derecha
        String fecha = new SimpleDateFormat("dd/MM/yyyy").format(new Date());
        Paragraph fechaParrafo = new Paragraph("Fecha: " + fecha);
        fechaParrafo.setAlignment(Element.ALIGN_RIGHT);
        document.add(new Paragraph(" "));
        document.add(fechaParrafo);

        document.close();
        return baos.toByteArray();
    }
}
