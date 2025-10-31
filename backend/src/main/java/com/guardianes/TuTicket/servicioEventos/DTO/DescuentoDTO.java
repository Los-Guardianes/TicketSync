package com.guardianes.TuTicket.servicioEventos.DTO;

import com.guardianes.TuTicket.servicioEventos.model.Descuento;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.TipoDescuento;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DescuentoDTO {
    private int idDescuento;
    private String codigo;
    private TipoDescuento tipoDesc;
    private BigDecimal valorDescuento;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer limiteTotal;
    private Integer limiteCliente;
    private Boolean esGlobal;
    private Integer idEvento;

    public DescuentoDTO(Descuento descuento) {
        this.idDescuento = descuento.getIdDescuento();
        this.codigo = descuento.getCodigo();
        this.tipoDesc = descuento.getTipoDesc();
        this.valorDescuento = descuento.getValorDescuento();
        this.fechaInicio = descuento.getFechaInicio();
        this.fechaFin = descuento.getFechaFin();
        this.limiteTotal = descuento.getLimiteTotal();
        this.limiteCliente = descuento.getLimiteCliente();
        this.esGlobal = descuento.getEsGlobal();
        this.idEvento = descuento.getEvento() != null ? descuento.getEvento().getIdEvento() : null;
    }
}
