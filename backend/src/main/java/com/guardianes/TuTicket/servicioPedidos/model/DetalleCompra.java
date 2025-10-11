package com.guardianes.TuTicket.servicioPedidos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.guardianes.TuTicket.servicioEventos.model.Entrada;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "detallecompra")
public class DetalleCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDetalleCompra")
    private Integer idDetalleCompra;

    @Column(nullable = false)
    private Integer cantidad;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idOrdenCompra", referencedColumnName = "idOrdenCompra")
    private OrdenCompra ordenCompra;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idEntrada", referencedColumnName = "idEntrada")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Entrada entrada;

    public DetalleCompra(OrdenCompra ordenCompra, Entrada entrada, Integer cantidad){
        this.ordenCompra = ordenCompra;
        this.entrada = entrada;
        this.cantidad = cantidad;
    }
}