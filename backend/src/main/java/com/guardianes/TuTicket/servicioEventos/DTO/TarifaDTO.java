package com.guardianes.TuTicket.servicioEventos.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.guardianes.TuTicket.servicioEventos.model.Tarifa;
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
}
