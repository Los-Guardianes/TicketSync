package com.guardianes.TuTicket.servicioUsuarios.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table (name = "organizador")
@PrimaryKeyJoinColumn(name = "idUsuario")
public class Organizador extends Usuario {

    @Column(nullable = false, length = 11, unique = true)
    private String ruc;

    @Column(nullable = false, length = 150)
    private String razonSocial;
}