package com.guardianes.TuTicket.servicioUsuarios.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "parametros_globales")
public class ParametrosGlobales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idParametro")
    private Integer idParametro;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal comisionGlobal;
}
