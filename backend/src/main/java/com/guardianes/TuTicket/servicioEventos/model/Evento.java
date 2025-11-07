package com.guardianes.TuTicket.servicioEventos.model;

import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import com.guardianes.TuTicket.servicioUsuarios.model.Organizador;
import com.guardianes.TuTicket.servicioEventos.model.TipoMoneda;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "evento", schema = "tuticket")
public class    Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idevento")
    private Integer idEvento;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "informadic", columnDefinition = "TEXT")
    private String informAdic;

    @Column(columnDefinition = "TEXT")
    private String restricciones;

    @Column(name = "urlimagen", length = 255)
    private String urlImagen;

    @Column(name = "urlmapa", length = 255)
    private String urlMapa;

    @Column(length = 255)
    private String direccion;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false)
    private TipoMoneda moneda;

    @Column(name = "maxcomprastickets", nullable = false)
    private Integer maxComprasTickets;

    @Column(nullable = false)
    private Boolean activo = true;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "idusuario", referencedColumnName = "idusuario")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Organizador organizador;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "idciudad", referencedColumnName = "idciudad")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Ciudad ciudad;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "idcategoria", referencedColumnName = "idcategoria")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private CategoriaEvento categoria;
}
