package com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO;

import com.guardianes.TuTicket.servicioEventos.model.Periodo;
import com.guardianes.TuTicket.servicioEventos.model.TipoDescuento;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeriodoDTO {
    private Integer idPeriodo;
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private TipoDescuento tipoDesc;
    private BigDecimal valorDescuento;
    private Integer idEvento;

    public PeriodoDTO(Periodo periodo) {
        this.idPeriodo = periodo.getIdPeriodo();
        this.nombre = periodo.getNombre();
        this.fechaInicio = periodo.getFechaInicio();
        this.fechaFin = periodo.getFechaFin();
        this.tipoDesc = periodo.getTipoDesc();
        this.valorDescuento = periodo.getValorDescuento();
        this.idEvento = periodo.getEvento().getIdEvento();
    }
}
