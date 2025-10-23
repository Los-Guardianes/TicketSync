package com.guardianes.TuTicket.servicioPedidos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @ManyToOne(optional = false)
    @JoinColumn(name = "idDetalleCompra", referencedColumnName = "idDetalleCompra")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DetalleCompra detalleCompra;
}
