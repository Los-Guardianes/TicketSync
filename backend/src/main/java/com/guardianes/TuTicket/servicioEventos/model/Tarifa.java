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
@Table(name = "tarifa")
public class Tarifa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTarifa")
    private Integer idTarifa;

    @Column(name = "precioBase", precision = 10, scale = 2)
    private BigDecimal precioBase;

    @Column(name = "activo", nullable = false)
    private Boolean activo = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idZona", referencedColumnName = "idZona")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Zona zona;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idTipoEntrada", referencedColumnName = "idTipoEntrada")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TipoEntrada tipoEntrada;

}
