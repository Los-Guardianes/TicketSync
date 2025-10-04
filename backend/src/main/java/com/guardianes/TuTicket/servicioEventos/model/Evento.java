package com.guardianes.TuTicket.servicioEventos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "evento")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idEvento;

    @Column(nullable = false, length = 150)
    private String nombre;

    // @Column(nullable = false)
    // private LocalDate fechaInicio;

    // @Column(nullable = false)
    // private LocalDate fechaFin;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String informAdic;

    @Column(columnDefinition = "TEXT")
    private String restricciones;

    @Column(nullable = false, length = 255)
    private String urlImagen;

    @Column(nullable = false, length = 255)
    private String urlMapa;

    @Column(nullable = false, length = 255)
    private String direccion;

    @Column
    private Boolean activo = true;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idCiudad", referencedColumnName = "idCiudad")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Ciudad ciudad;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idCategoria", referencedColumnName = "idCategoria")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CatEvento categoria;


}
