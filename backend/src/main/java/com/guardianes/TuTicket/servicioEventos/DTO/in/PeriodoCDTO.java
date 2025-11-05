package com.guardianes.TuTicket.servicioEventos.DTO.in;

import java.math.BigDecimal;
import java.time.LocalDate;
import com.guardianes.TuTicket.servicioEventos.model.TipoDescuento;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PeriodoCDTO {
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private TipoDescuento tipoDesc;
    private BigDecimal valorDescuento;
    private Integer idEvento;
}
