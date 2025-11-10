package com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO;

import com.guardianes.TuTicket.servicioEventos.model.Tarifa;
import com.guardianes.TuTicket.servicioEventos.model.TipoEntrada;
import com.guardianes.TuTicket.servicioEventos.model.Zona;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@AllArgsConstructor
@Data
public class TarifaDTO {
    private Integer idTarifa;
    private BigDecimal precioBase;
    private TipoEntradaDTO tipoEntradaDTO;
    private ZonaDTO zonaDTO;

    public TarifaDTO(Tarifa tarifa) {
        this.idTarifa = tarifa.getIdTarifa();
        this.precioBase = tarifa.getPrecioBase();
        this.tipoEntradaDTO = new TipoEntradaDTO(tarifa.getTipoEntrada());

        this.zonaDTO = new ZonaDTO(tarifa.getZona());

    }

    public Tarifa toModel(Zona zona, TipoEntrada tipoEntrada) {
        return new Tarifa(
                this.idTarifa,
                this.precioBase,
                true,
                zona,
                tipoEntrada
        );
    }
}