package com.guardianes.TuTicket.servicioEventos.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class TemporadaDTO {
    private String nombre; // "Preventa", "Venta General"
    private String fechaInicio;
    private String fechaFin;
    private BigDecimal porcentajeDesc;
}
