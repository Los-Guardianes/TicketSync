package com.guardianes.TuTicket.servicioUsuarios.reportes;

import com.guardianes.TuTicket.servicioUsuarios.model.Organizador;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
public class ReporteOrganizadorService {
    public ByteArrayInputStream generarExcelOrganizadores(List<Organizador> organizadores) throws IOException {

        // Nombres de las columnas
        String[] columnas = {"ID", "RUC", "RazonSocial", "NombreRepresentante", "ApellidoRepresentante","EmailRepresentante", "Verificado"}; // Ajusta esto a tu modelo

        // --- Obtenemos y formateamos la fecha actual ---
        Locale localeEs = new Locale("es", "ES"); // Locale para español
        LocalDate fechaActual = LocalDate.now();
        String diaSemana = fechaActual.getDayOfWeek().getDisplayName(TextStyle.FULL, localeEs);
        String fechaFormateada = fechaActual.format(DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", localeEs));
        // Capitalizamos el día de la semana
        diaSemana = diaSemana.substring(0, 1).toUpperCase() + diaSemana.substring(1);
        String textoFecha = "Fecha de Emisión: " + diaSemana + ", " + fechaFormateada;
        // Basado en la hora , esto saldría como:
        // "Fecha de Emisión: Domingo, 26 de octubre de 2025"

        // Usamos try-with-resources para que el workbook y el stream se cierren solos
        try (
                Workbook workbook = new XSSFWorkbook(); // Crea un libro de Excel (.xlsx)
                ByteArrayOutputStream out = new ByteArrayOutputStream(); // Un stream para escribir en memoria
        ) {
            Sheet sheet = workbook.createSheet("Organizadores"); // Crea una hoja

            // --- Creación de la Fuente para el titulo ---
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 16); // Letra más grande

            CellStyle titleCellStyle = workbook.createCellStyle();
            titleCellStyle.setFont(titleFont);
            titleCellStyle.setAlignment(HorizontalAlignment.CENTER); // Centrado
            titleCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            // --- Estilo para la Fecha ---
            Font dateFont = workbook.createFont();
            dateFont.setItalic(true);
            dateFont.setFontHeightInPoints((short) 11);

            CellStyle dateCellStyle = workbook.createCellStyle();
            dateCellStyle.setFont(dateFont);
            dateCellStyle.setAlignment(HorizontalAlignment.LEFT); // Alineado a la izquierda

            // De la tabla
            // --- Creación de la Fuente para la cabecera ---
            Font headerFont = workbook.createFont();
            headerFont.setBold(true); // Negrita
            headerFont.setFontHeightInPoints((short) 12); // Tamaño
            headerFont.setColor(IndexedColors.WHITE.getIndex()); // Color de letra blanco

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont); // Aplicar la fuente
            headerCellStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex()); // Color de fondo
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND); // Patrón de relleno sólido

            // --------------Creacion de filas------------
            // --- Fila 0: Título Principal ---
            Row titleRow = sheet.createRow(0);
            titleRow.setHeightInPoints(20); // Un poco más de altura para el título
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("Reporte de Organizadores Registrados");
            titleCell.setCellStyle(titleCellStyle);
            // Combinamos la fila 0, desde la columna 0 hasta la última columna
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, columnas.length - 1));

            // --- Fila 1: Fecha de Emisión ---
            Row dateRow = sheet.createRow(2);
            Cell dateCell = dateRow.createCell(0);
            dateCell.setCellValue(textoFecha);
            dateCell.setCellStyle(dateCellStyle);
            // Combinamos la fila 1, desde la columna 0 hasta la última columna
            sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, columnas.length - 1));

            // --- PARA LA TABLA ---
            // --- 1. Crear la Fila de Cabecera ---
            Row headerRow = sheet.createRow(4);
            for (int col = 0; col < columnas.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columnas[col]);
                // Aquí se puede agregar estilos
                cell.setCellStyle(headerCellStyle);
            }

            // --- 2. Llenar las Filas con Datos ---
            int rowIdx = 5; // Empieza en la fila 4
            for (Organizador org : organizadores) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(org.getIdUsuario()); // Asumiendo que tiene getId()
                row.createCell(1).setCellValue(org.getRuc()); // Asumiendo que tiene getRuc()
                row.createCell(2).setCellValue(org.getRazonSocial()); // Asumiendo que tiene getNombre()
                row.createCell(3).setCellValue(org.getNombre()); // Asumiendo que tiene getNombre()
                row.createCell(4).setCellValue(org.getApellido()); // Asumiendo que tiene getApellido()
                row.createCell(5).setCellValue(org.getEmail()); // Asumiendo que tiene getEmail()
                row.createCell(6).setCellValue(org.getVerificado() ? "Habilitado" : "Inhabilitado"); // Asumiendo
            }

            sheet.setColumnWidth(0, 10 * 256); // Columna ID (10 caracteres)
            sheet.setColumnWidth(1, 15 * 256); // Columna RUC (15 caracteres)
            sheet.setColumnWidth(2, 30 * 256); // Columna RazonSocial (30 caracteres)
            sheet.setColumnWidth(3, 30 * 256); // Columna NombreRepresentante (30 caracteres)
            sheet.setColumnWidth(4, 30 * 256); // Columna ApellidoRepresentante (30 caracteres)
            sheet.setColumnWidth(5, 30 * 256); // Columna EmailRepresentante (30 caracteres)
            sheet.setColumnWidth(6, 15 * 256); // Columna Verificado (15 caracteres)

            // Escribir el libro en el stream de salida en memoria
            workbook.write(out);

            // Convertir el stream de salida a un stream de entrada para la respuesta
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
