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
@Table(name = "catevento")
public class CatEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategoria;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal comision;

    @Column
    private Boolean activo = true;


}