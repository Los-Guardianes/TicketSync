package com.guardianes.TuTicket.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrdenDeCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idOrdenCompra;

    @Column(nullable = false)
    private LocalDateTime fechaOrden;

    @Column(nullable = false, length = 50)
    private String metodoPago;

    @Column(nullable = false)
    private Boolean usado;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idUsuario", referencedColumnName = "idUsuario")
    private Usuario usuario;
}
