package com.guardianes.TuTicket.servicioEventos.DTO.in;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@AllArgsConstructor
@Data
public class TarifaCDTO {
    private BigDecimal precioBase;
    private TipoEntradaCDTO tipoEntrada;
    private ZonaCDTO zona;
}
