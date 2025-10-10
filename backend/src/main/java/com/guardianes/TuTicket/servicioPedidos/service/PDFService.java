package com.guardianes.TuTicket.servicioPedidos.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import com.guardianes.TuTicket.servicioPedidos.repo.OrdenCompraRepo;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import com.guardianes.TuTicket.servicioUsuarios.service.UsuarioService;
import com.itextpdf.text.BaseColor;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
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

    public Image generarQR(String contenido) throws Exception {
        BitMatrix matrix = new MultiFormatWriter().encode(contenido, BarcodeFormat.QR_CODE, 100, 100);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", baos);
        return Image.getInstance(baos.toByteArray());
    }

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

    public byte[] generarTicketPDF(String codigoTicket) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        Rectangle ticketSize = new Rectangle(650, 300);
        Document document = new Document(ticketSize, 20, 20, 10, 10);
        PdfWriter writer = PdfWriter.getInstance(document, baos);
        document.open();

        Font fontBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
        Font fontNormal = FontFactory.getFont(FontFactory.HELVETICA, 9);
        Font fontSmall = FontFactory.getFont(FontFactory.HELVETICA, 8);

        PdfPTable header = new PdfPTable(2);
        header.setWidthPercentage(100);
        header.setWidths(new float[]{1, 3});

        Image logo = Image.getInstance("src/main/resources/TUTICKET_PNG_SIN_ESPACIOS.png");
        logo.scaleToFit(60, 25);
        PdfPCell logoCell = new PdfPCell(logo);
        logoCell.setBorder(Rectangle.NO_BORDER);
        logoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        header.addCell(logoCell);

        PdfPCell titulo = new PdfPCell(new Phrase("COSTA VERDE, CIRCUITO DE PLAYAS, SAN MIGUEL, PERÚ", fontSmall));
        titulo.setHorizontalAlignment(Element.ALIGN_RIGHT);
        titulo.setBorder(Rectangle.NO_BORDER);
        header.addCell(titulo);

        document.add(header);
        document.add(new Paragraph(" "));

        Paragraph evento = new Paragraph("MI EVENTO – “TICKETSYNC”", fontBold);
        evento.setAlignment(Element.ALIGN_CENTER);
        document.add(evento);
        document.add(new Paragraph(" "));

        PdfPTable mainTable = new PdfPTable(3);
        mainTable.setWidthPercentage(100);
        mainTable.setWidths(new float[]{3, 0.05f, 1});

        PdfPCell left = new PdfPCell();
        left.setBorder(Rectangle.NO_BORDER);
        left.setPadding(8);

        left.addElement(new Paragraph("LUIS IZARRA", fontNormal));
        left.addElement(new Paragraph("DNI: ********", fontNormal));
        left.addElement(new Paragraph("Tipo de entrada: PREFERENCIAL", fontNormal));
        left.addElement(new Paragraph("Asiento: PRE-IZQ-C01", fontNormal));
        left.addElement(new Paragraph("Sector: 203", fontNormal));
        left.addElement(new Paragraph("Fecha: 02 DE AGOSTO DEL 2025", fontNormal));
        left.addElement(new Paragraph("Hora: 06:00 P.M.", fontNormal));
        left.addElement(new Paragraph("Precio: S/100.00", fontNormal));
        left.addElement(new Paragraph("\n* Público en general", fontSmall));
        left.addElement(new Paragraph("* PROHIBIDO el ingreso con bebidas o alimentos", fontSmall));
        mainTable.addCell(left);

        PdfPCell dottedLine = new PdfPCell();
        dottedLine.setBorder(Rectangle.NO_BORDER);
        dottedLine.setCellEvent(new PdfPCellEvent() {
            @Override
            public void cellLayout(PdfPCell cell, Rectangle position, PdfContentByte[] canvases) {
                PdfContentByte canvas = canvases[PdfPTable.LINECANVAS];
                canvas.setLineDash(3f, 3f);
                canvas.moveTo(position.getLeft() + 1, position.getBottom());
                canvas.lineTo(position.getLeft() + 1, position.getTop());
                canvas.stroke();
            }
        });
        mainTable.addCell(dottedLine);

        PdfPCell right = new PdfPCell();
        right.setBorder(Rectangle.NO_BORDER);
        right.setHorizontalAlignment(Element.ALIGN_CENTER);
        right.setVerticalAlignment(Element.ALIGN_MIDDLE);

        Image qr = generarQR(codigoTicket);
        qr.scaleToFit(90, 90);
        right.addElement(qr);
        right.addElement(new Paragraph("\nS/100.00", fontBold));

        mainTable.addCell(right);
        document.add(mainTable);

        PdfContentByte canvas = writer.getDirectContent();
        BaseFont bf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        canvas.saveState();
        canvas.beginText();
        canvas.setFontAndSize(bf, 9);
        canvas.showTextAligned(Element.ALIGN_LEFT, "LUIS IZARRA — PREFERENCIAL", ticketSize.getWidth() - 10, 90, 90);
        canvas.endText();
        canvas.restoreState();

        document.close();
        return baos.toByteArray();
    }

}
