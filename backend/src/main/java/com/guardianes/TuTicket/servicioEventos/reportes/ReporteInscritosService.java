package com.guardianes.TuTicket.servicioEventos.reportes;

import com.guardianes.TuTicket.servicioPedidos.model.Ticket;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
public class ReporteInscritosService {

        public ByteArrayInputStream generarExcelInscritos(List<Ticket> tickets, String nombreEvento)
                        throws IOException {

                // Nombres de las columnas
                String[] columnas = { "Nombre", "Apellido", "Email", "Tipo Entrada", "Zona", "Fecha Compra",
                                "Fecha Función" };

                // --- Obtenemos y formateamos la fecha actual ---
                Locale localeEs = Locale.of("es", "ES");
                LocalDate fechaActual = LocalDate.now(ZoneId.of("America/Lima"));
                String diaSemana = fechaActual.getDayOfWeek().getDisplayName(TextStyle.FULL, localeEs);
                String fechaFormateada = fechaActual
                                .format(DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", localeEs));
                diaSemana = diaSemana.substring(0, 1).toUpperCase() + diaSemana.substring(1);
                String textoFecha = "Fecha de Emisión: " + diaSemana + ", " + fechaFormateada;

                try (
                                Workbook workbook = new XSSFWorkbook();
                                ByteArrayOutputStream out = new ByteArrayOutputStream();) {
                        Sheet sheet = workbook.createSheet("Inscritos");

                        // --- Estilo para el título ---
                        Font titleFont = workbook.createFont();
                        titleFont.setBold(true);
                        titleFont.setFontHeightInPoints((short) 16);

                        CellStyle titleCellStyle = workbook.createCellStyle();
                        titleCellStyle.setFont(titleFont);
                        titleCellStyle.setAlignment(HorizontalAlignment.CENTER);
                        titleCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

                        // --- Estilo para la fecha ---
                        Font dateFont = workbook.createFont();
                        dateFont.setItalic(true);
                        dateFont.setFontHeightInPoints((short) 11);

                        CellStyle dateCellStyle = workbook.createCellStyle();
                        dateCellStyle.setFont(dateFont);
                        dateCellStyle.setAlignment(HorizontalAlignment.LEFT);

                        // --- Estilo para la cabecera ---
                        Font headerFont = workbook.createFont();
                        headerFont.setBold(true);
                        headerFont.setFontHeightInPoints((short) 12);
                        headerFont.setColor(IndexedColors.WHITE.getIndex());

                        CellStyle headerCellStyle = workbook.createCellStyle();
                        headerCellStyle.setFont(headerFont);
                        headerCellStyle.setFillForegroundColor(IndexedColors.GREEN.getIndex());
                        headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                        // --- Fila 0: Título ---
                        Row titleRow = sheet.createRow(0);
                        titleRow.setHeightInPoints(20);
                        Cell titleCell = titleRow.createCell(0);
                        titleCell.setCellValue(
                                        "Listado de Inscritos - " + (nombreEvento != null ? nombreEvento : "Evento"));
                        titleCell.setCellStyle(titleCellStyle);
                        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, columnas.length - 1));

                        // --- Fila 2: Fecha ---
                        Row dateRow = sheet.createRow(2);
                        Cell dateCell = dateRow.createCell(0);
                        dateCell.setCellValue(textoFecha);
                        dateCell.setCellStyle(dateCellStyle);
                        sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, columnas.length - 1));

                        // --- Fila 4: Cabecera de tabla ---
                        Row headerRow = sheet.createRow(4);
                        for (int col = 0; col < columnas.length; col++) {
                                Cell cell = headerRow.createCell(col);
                                cell.setCellValue(columnas[col]);
                                cell.setCellStyle(headerCellStyle);
                        }

                        // --- Filas de datos ---
                        int rowIdx = 5;
                        for (Ticket ticket : tickets) {
                                Row row = sheet.createRow(rowIdx++);

                                String nombre = "";
                                String apellido = "";
                                String email = "";
                                if (ticket.getDetalleCompra() != null
                                                && ticket.getDetalleCompra().getOrdenCompra() != null
                                                && ticket.getDetalleCompra().getOrdenCompra().getUsuario() != null) {
                                        nombre = ticket.getDetalleCompra().getOrdenCompra().getUsuario()
                                                        .getNombre() != null
                                                                        ? ticket.getDetalleCompra().getOrdenCompra()
                                                                                        .getUsuario().getNombre()
                                                                        : "";
                                        apellido = ticket.getDetalleCompra().getOrdenCompra().getUsuario()
                                                        .getApellido() != null
                                                                        ? ticket.getDetalleCompra().getOrdenCompra()
                                                                                        .getUsuario().getApellido()
                                                                        : "";
                                        email = ticket.getDetalleCompra().getOrdenCompra().getUsuario()
                                                        .getEmail() != null
                                                                        ? ticket.getDetalleCompra().getOrdenCompra()
                                                                                        .getUsuario().getEmail()
                                                                        : "";
                                }
                                row.createCell(0).setCellValue(nombre);
                                row.createCell(1).setCellValue(apellido);
                                row.createCell(2).setCellValue(email);
                                row.createCell(3).setCellValue(
                                                ticket.getDetalleCompra() != null
                                                                && ticket.getDetalleCompra().getTarifa() != null
                                                                && ticket.getDetalleCompra().getTarifa()
                                                                                .getTipoEntrada() != null
                                                                                                ? ticket.getDetalleCompra()
                                                                                                                .getTarifa()
                                                                                                                .getTipoEntrada()
                                                                                                                .getNombre()
                                                                                                : "");
                                row.createCell(4).setCellValue(
                                                ticket.getDetalleCompra() != null
                                                                && ticket.getDetalleCompra().getTarifa() != null
                                                                && ticket.getDetalleCompra().getTarifa()
                                                                                .getZona() != null
                                                                                                ? ticket.getDetalleCompra()
                                                                                                                .getTarifa()
                                                                                                                .getZona()
                                                                                                                .getNombre()
                                                                                                : "");
                                row.createCell(5).setCellValue(
                                                ticket.getDetalleCompra() != null
                                                                && ticket.getDetalleCompra().getOrdenCompra() != null
                                                                && ticket.getDetalleCompra().getOrdenCompra()
                                                                                .getFechaOrden() != null
                                                                                                ? ticket.getDetalleCompra()
                                                                                                                .getOrdenCompra()
                                                                                                                .getFechaOrden()
                                                                                                                .toLocalDate()
                                                                                                                .toString()
                                                                                                : "");
                                row.createCell(6).setCellValue(
                                                ticket.getDetalleCompra() != null
                                                                && ticket.getDetalleCompra().getOrdenCompra() != null
                                                                && ticket.getDetalleCompra().getOrdenCompra()
                                                                                .getFuncion() != null
                                                                                                ? ticket.getDetalleCompra()
                                                                                                                .getOrdenCompra()
                                                                                                                .getFuncion()
                                                                                                                .getFechaInicio()
                                                                                                                .toString()
                                                                                                : "");
                        }

                        // Ajustar anchos de columna
                        sheet.setColumnWidth(0, 20 * 256); // Nombre
                        sheet.setColumnWidth(1, 20 * 256); // Apellido
                        sheet.setColumnWidth(2, 30 * 256); // Email
                        sheet.setColumnWidth(3, 20 * 256); // Tipo Entrada
                        sheet.setColumnWidth(4, 15 * 256); // Zona
                        sheet.setColumnWidth(5, 15 * 256); // Fecha Compra
                        sheet.setColumnWidth(6, 15 * 256); // Fecha Función

                        workbook.write(out);
                        return new ByteArrayInputStream(out.toByteArray());
                }
        }
}
