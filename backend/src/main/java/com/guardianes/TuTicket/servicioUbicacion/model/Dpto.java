package com.guardianes.TuTicket.servicioUbicacion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table (name ="dpto")
public class Dpto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDpto;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column
    private Boolean activo = true;

}
