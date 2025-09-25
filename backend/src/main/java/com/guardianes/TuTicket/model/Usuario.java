package com.guardianes.TuTicket.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, length = 150, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    private String hashContrasena;

    @Column
    private Boolean verificado = false;

    @Column(length = 9, unique = true)
    private String telefono;

    @Column
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "idCiudad", referencedColumnName = "idCiudad")
    private Ciudad ciudad;

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
}
