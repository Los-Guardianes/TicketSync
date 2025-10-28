package com.guardianes.TuTicket.servicioPedidos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.guardianes.TuTicket.servicioEventos.model.Periodo;
import com.guardianes.TuTicket.servicioEventos.model.Tarifa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "detalle_compra")
public class DetalleCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDetalleCompra")
    private Integer idDetalleCompra;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precioDetalle", nullable = false, precision = 5, scale = 2)
    private BigDecimal precioDetalle;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idOrdenCompra", referencedColumnName = "idOrdenCompra")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private OrdenCompra ordenCompra;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idTarifa", referencedColumnName = "idTarifa")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Tarifa tarifa;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idPeriodo", referencedColumnName = "idPeriodo")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Periodo periodo;
}
