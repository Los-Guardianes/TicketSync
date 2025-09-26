package com.guardianes.TuTicket.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrdenDeCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idOrdenCompra;

    @Column(nullable = false)
    private LocalDateTime fechaOrden;

    @Column(nullable = false, length = 50)
    private String metodoPago;

    @Column
    private Boolean activo = true;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idUsuario", referencedColumnName = "idUsuario")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Usuario usuario;

    public void setIdOrdenCompra(Integer idOrdenCompra) {
        this.idOrdenCompra = idOrdenCompra;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
