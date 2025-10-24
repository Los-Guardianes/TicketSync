package com.guardianes.TuTicket.servicioEventos.DTO;

import com.guardianes.TuTicket.servicioEventos.model.TipoDescuento;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PeriodoDTO {
    private String nombre; // "Preventa", "Venta General"
    //Esto no debe ser string porsiacaso
    private String fechaInicio;
    private String fechaFin;

    private TipoDescuento tipoDescuento;
    private BigDecimal valorDescuento;
    private Integer idEvento;
}
