package com.guardianes.TuTicket.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Dpto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDpto;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column
    private Boolean activo;

    public void setIdDpto(Integer idDpto) {
        this.idDpto = idDpto;
    }

    public Integer getIdDpto() {
        return idDpto;
    }
}
