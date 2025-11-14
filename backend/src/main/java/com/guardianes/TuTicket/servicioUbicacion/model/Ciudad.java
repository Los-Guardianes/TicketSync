package com.guardianes.TuTicket.servicioUbicacion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table (name ="ciudad")
public class Ciudad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCiudad;

    @Column(nullable = false, length = 100)
    private String nombre;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idDpto", nullable = false)
    private Dpto dpto;

    @Column(length = 10)
    private String codPostal;

    @Column
    private Boolean activo = true;

}
