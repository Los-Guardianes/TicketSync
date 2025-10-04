package com.guardianes.TuTicket.servicioUsuarios.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@NoArgsConstructor
@Data
@Table(name = "admint")
@PrimaryKeyJoinColumn(name = "idUsuario")
public class Admin extends Usuario {

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal comisionGlobal;
}
