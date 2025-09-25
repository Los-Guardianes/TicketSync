package com.guardianes.TuTicket.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@PrimaryKeyJoinColumn(name = "idUsuario")
public class Organizador extends Usuario {

    @Column(nullable = false, length = 10, unique = true)
    private String ruc;

    @Column(nullable = false, length = 150)
    private String razonSocial;
}