package com.guardianes.TuTicket.servicioEventos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "entrada")
public class Entrada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idEntrada")
    private Integer idEntrada;

    @Column(name = "precioCalculado", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioCalculado;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idEvento", referencedColumnName = "idEvento")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Evento evento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idZona", referencedColumnName = "idZona")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Zona zona;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idTemporada", referencedColumnName = "idTemporada")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Temporada temporada;
}

