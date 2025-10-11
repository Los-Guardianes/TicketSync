package com.guardianes.TuTicket.servicioPedidos.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetalleCompraDTO {
    private Integer cantidad;
    private Integer idZona;
    private Integer idTemporada;
}
