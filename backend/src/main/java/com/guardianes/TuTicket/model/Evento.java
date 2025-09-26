package com.guardianes.TuTicket.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idEvento;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false)
    private LocalDate fechaInicio;

    @Column(nullable = false)
    private LocalDate fechaFin;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String informacionAdic;

    @Column(columnDefinition = "TEXT")
    private String restricciones;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idCiudad", referencedColumnName = "idCiudad")
    private Ciudad ciudad;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idCategoria", referencedColumnName = "idCategoria")
    private CategoriaEvento categoria;

    public void setIdEvento(Integer idEvento) {
        this.idEvento = idEvento;
    }
}
