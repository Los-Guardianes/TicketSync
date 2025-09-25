package com.guardianes.TuTicket.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@PrimaryKeyJoinColumn(name = "idUsuario")
public class Cliente extends Usuario {

    @Column(nullable = false, length = 8, unique = true)
    private String DNI;

    @Column(nullable = false)
    private LocalDate fechaNacimiento;
}