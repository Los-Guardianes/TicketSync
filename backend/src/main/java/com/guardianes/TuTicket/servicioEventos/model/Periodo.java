package com.guardianes.TuTicket.servicioEventos.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.guardianes.TuTicket.servicioEventos.model.TipoDescuento;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "periodo")
public class Periodo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPeriodo")
    private Integer idPeriodo;

    @Column(name = "nombre", length = 100)
    private String nombre;

    @Column(name = "fechaInicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fechaFin", nullable = false)
    private LocalDate fechaFin;

    @Column
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private TipoDescuento tipoDesc;

    @Column(name = "valorDescuento", precision = 5, scale = 2)
    private BigDecimal valorDescuento;

    @Column(name = "activo", nullable = false)
    private Boolean activo = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idEvento", referencedColumnName = "idEvento")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Evento evento;
}
