package com.guardianes.TuTicket.servicioPedidos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "ticket")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTicket")
    private Integer idTicket;

    @Column(nullable = false)
    private Boolean usado = false;

    @Column(nullable = false)
    private String hashTicket;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal precioUnitario;

    @Column(precision = 5, scale = 2)
    private BigDecimal conceptoDevolucion;

    @Column(nullable = false)
    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idDetalleCompra", referencedColumnName = "idDetalleCompra")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DetalleCompra detalleCompra;
}
