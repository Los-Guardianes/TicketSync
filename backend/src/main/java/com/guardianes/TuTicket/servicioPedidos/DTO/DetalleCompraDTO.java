package com.guardianes.TuTicket.servicioPedidos.DTO;

import com.guardianes.TuTicket.servicioEventos.model.Periodo;
import com.guardianes.TuTicket.servicioEventos.model.Tarifa;
import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class DetalleCompraDTO {
    private Integer cantidad;
    private BigDecimal precioDetalle;
    private Integer idTarifa;
    private Integer idPeriodo;

    public DetalleCompra toModel(OrdenCompra ordenCompra, Tarifa t, Periodo p) {
        return new DetalleCompra(
                null,
                this.cantidad,
                this.precioDetalle,
                ordenCompra,
                t,
                p
        );
    }
}
