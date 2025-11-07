package com.guardianes.TuTicket.servicioPedidos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "devolucion")
public class Devolucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDevolucion")
    private Integer idDevolucion;

    @Column(nullable = false)
    private LocalDateTime fechaDev;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentDev;

    @Column(nullable = false)
    private Boolean activo = true;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idTicket", referencedColumnName = "idTicket", unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Ticket ticket;
}
