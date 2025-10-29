package com.guardianes.TuTicket.servicioEventos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "zona_funcion")
public class ZonaXFuncion {

    @EmbeddedId
    private ZonaXFuncionId id;

    @MapsId("idZona")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "idZona", referencedColumnName = "idZona", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Zona zona;

    @MapsId("idFuncion")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "idFuncion", referencedColumnName = "idFuncion", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Funcion funcion;

    @Column(name = "comprasActuales", nullable = false)
    private Integer comprasActuales = 0;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;
}
