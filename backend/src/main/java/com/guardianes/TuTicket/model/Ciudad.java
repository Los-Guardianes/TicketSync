package com.guardianes.TuTicket.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
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

    public void setIdCiudad(Integer idCiudad) {
        this.idCiudad = idCiudad;
    }

    public Dpto getDpto() {
        return dpto;
    }

    public void setDpto(Dpto dpto) {
        this.dpto = dpto;
    }
}
