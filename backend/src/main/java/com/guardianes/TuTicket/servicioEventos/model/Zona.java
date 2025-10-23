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
@Table(name = "zona")
public class Zona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idZona")
    private Integer idZona;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "comprasActuales", nullable = false)
    private Integer comprasActuales = 0;

    @Column(name = "aforo", nullable = false)
    private Integer aforo;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idEvento", referencedColumnName = "idEvento")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Evento evento;
}
