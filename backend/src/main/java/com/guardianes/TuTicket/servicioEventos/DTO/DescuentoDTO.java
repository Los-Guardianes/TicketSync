package com.guardianes.TuTicket.servicioEventos.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DescuentoDTO {

    private Integer idDescuento;

    private String codigo;

    // 'MONTO' o 'PORCENTAJE' tal como está en el enum tipoDescuento
    private String tipoDesc;

    // DECIMAL(10,2) -> BigDecimal en Java
    private BigDecimal valorDescuento;

    // DATE -> LocalDate (Jackson lo serializa como "YYYY-MM-DD")
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    private Integer limiteTotal;    // INT NOT NULL
    private Integer limiteCliente;  // INT (nullable)

    private Boolean activo;         // BOOLEAN
}
