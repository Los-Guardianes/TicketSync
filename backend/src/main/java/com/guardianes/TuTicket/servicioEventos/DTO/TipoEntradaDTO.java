package com.guardianes.TuTicket.servicioEventos.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class TipoEntradaDTO {
    private String nombre; // "VIP", "General"
    private String moneda; // "PEN", "USD"
    private BigDecimal precioBase;
    private String descripcion;
    private Integer cantidadMax;
}
