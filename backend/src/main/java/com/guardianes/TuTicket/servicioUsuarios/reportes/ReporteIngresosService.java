package com.guardianes.TuTicket.servicioUsuarios.reportes;

import com.guardianes.TuTicket.servicioUsuarios.DTO.out.ReporteIngresosDTO;
import com.guardianes.TuTicket.servicioUsuarios.repo.ReporteIngresos;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
public class ReporteIngresosService {

    @Autowired
    private ReporteIngresos reporteIngresos;

    public ByteArrayInputStream generarExcelIngresos() throws IOException {

        // 1. OBTENER DATOS
        List<ReporteIngresosDTO> reporteData = reporteIngresos.obtenerReporteIngresos();
        String[] columnas = {"Organizador", "Evento", "Total Ventas (S/)", "Comisión (%)", "Ganancia TuTicket (S/)"};

        // 2. PREPARAR FECHA (Lógica traída del otro reporte)
        Locale localeEs = new Locale("es", "ES");
        LocalDate fechaActual = LocalDate.now(ZoneId.of("America/Lima"));
        String diaSemana = fechaActual.getDayOfWeek().getDisplayName(TextStyle.FULL, localeEs);
        String fechaFormateada = fechaActual.format(DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", localeEs));
        // Capitalizar primera letra del día
        diaSemana = diaSemana.substring(0, 1).toUpperCase() + diaSemana.substring(1);
        String textoFecha = "Fecha de Emisión: " + diaSemana + ", " + fechaFormateada;

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Ingresos por Comisión");

            // ==========================================
            // 3. DEFINICIÓN DE ESTILOS (Una sola vez)
            // ==========================================

            // Estilo Título Principal
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 16);
            titleFont.setColor(IndexedColors.DARK_TEAL.getIndex()); // Un toque de color (opcional)

            CellStyle titleCellStyle = workbook.createCellStyle();
            titleCellStyle.setFont(titleFont);
            titleCellStyle.setAlignment(HorizontalAlignment.CENTER);
            titleCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // Estilo Fecha
            Font dateFont = workbook.createFont();
            dateFont.setItalic(true);
            dateFont.setFontHeightInPoints((short) 11);

            CellStyle dateCellStyle = workbook.createCellStyle();
            dateCellStyle.setFont(dateFont);
            dateCellStyle.setAlignment(HorizontalAlignment.LEFT);

            // Estilo Cabecera Tabla (Azul)
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);

            // Estilo Moneda (Para el cuerpo de la tabla)
            CellStyle currencyStyle = workbook.createCellStyle();
            DataFormat format = workbook.createDataFormat();
            currencyStyle.setDataFormat(format.getFormat("\"S/\" #,##0.00")); // Con el fix de las comillas

            // Estilo Porcentaje
            CellStyle percentStyle = workbook.createCellStyle();
            percentStyle.setDataFormat(format.getFormat("0.00%"));

            // ==========================================
            // 4. CONSTRUCCIÓN DEL REPORTE
            // ==========================================

            // --- Fila 0: Título Principal ---
            Row titleRow = sheet.createRow(0);
            titleRow.setHeightInPoints(30);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("Reporte de Ingresos por Comisiones"); // Título correcto
            titleCell.setCellStyle(titleCellStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, columnas.length - 1));

            // --- Fila 2: Fecha de Emisión (Dejamos la fila 1 vacía como espacio) ---
            Row dateRow = sheet.createRow(2);
            Cell dateCell = dateRow.createCell(0);
            dateCell.setCellValue(textoFecha);
            dateCell.setCellStyle(dateCellStyle);
            sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, columnas.length - 1));

            // --- Fila 4: Cabecera de la Tabla (Dejamos la fila 3 vacía) ---
            Row headerRow = sheet.createRow(4);
            for (int col = 0; col < columnas.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columnas[col]);
                cell.setCellStyle(headerCellStyle);
            }

            // --- Filas 5 en adelante: Datos ---
            int rowIdx = 5;
            BigDecimal totalGananciaGlobal = BigDecimal.ZERO;

            for (ReporteIngresosDTO dato : reporteData) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(dato.getOrganizador());
                row.createCell(1).setCellValue(dato.getEvento());

                // Venta Total
                Cell cellVentas = row.createCell(2);
                cellVentas.setCellValue(dato.getTotalVentasEvento().doubleValue());
                cellVentas.setCellStyle(currencyStyle);

                // Comisión (Convertimos el número entero ej: 15 a porcentaje 0.15 para Excel)
                Cell cellComision = row.createCell(3);
                // Asumiendo que viene como 15.00, lo dividimos entre 100 para formato %
                cellComision.setCellValue(dato.getPorcentajeComision().doubleValue() / 100);
                cellComision.setCellStyle(percentStyle);

                // Ganancia
                Cell cellGanancia = row.createCell(4);
                cellGanancia.setCellValue(dato.getGananciaPlataforma().doubleValue());
                cellGanancia.setCellStyle(currencyStyle);

                if(dato.getGananciaPlataforma() != null) {
                    totalGananciaGlobal = totalGananciaGlobal.add(dato.getGananciaPlataforma());
                }
            }

            // --- Fila Final: TOTALES ---
            Row totalRow = sheet.createRow(rowIdx + 1);

            Cell totalLabel = totalRow.createCell(3);
            totalLabel.setCellValue("TOTAL GANANCIAS:");
            totalLabel.setCellStyle(headerCellStyle); // Reusamos el estilo azul para destacar

            Cell totalValue = totalRow.createCell(4);
            totalValue.setCellValue(totalGananciaGlobal.doubleValue());
            totalValue.setCellStyle(currencyStyle);

            // --- Ajuste final de columnas ---
            for(int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}