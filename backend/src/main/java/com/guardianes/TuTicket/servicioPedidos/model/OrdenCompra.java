package com.guardianes.TuTicket.servicioPedidos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrdenCompra {

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


}
