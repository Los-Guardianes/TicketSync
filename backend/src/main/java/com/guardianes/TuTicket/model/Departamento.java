package com.guardianes.TuTicket.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Departamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDepartamento;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private Boolean estado;

    public void setIdDepartamento(Integer idDepartamento) {
        this.idDepartamento = idDepartamento;
    }

    public Integer getIdDepartamento() {
        return idDepartamento;
    }
}
