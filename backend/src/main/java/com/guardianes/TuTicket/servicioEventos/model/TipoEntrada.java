package com.guardianes.TuTicket.servicioEventos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "tipoentrada")
public class TipoEntrada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTipoEntrada")
    private Integer idTipoEntrada;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "moneda", nullable = false)
    private String moneda;

    @Column(name = "precioBase", nullable = false, precision = 5, scale = 2)
    private BigDecimal precioBase;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "cantidadMax", nullable = false)
    private Integer cantidadMax;

    @Column(name = "activo", nullable = false)
    private Boolean activo = false;
}
