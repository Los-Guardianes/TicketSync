package com.guardianes.TuTicket.servicioEventos.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.TipoMoneda;
import com.guardianes.TuTicket.servicioUbicacion.DTO.CiudadDTO;
import com.guardianes.TuTicket.servicioUsuarios.DTO.OrganizadorDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventoDTO {
    private Integer idEvento;
    private String nombre;
    private String descripcion;
    private String informaAdic;
    private String restricciones;
    private String urlImagen;
    private String urlMapa;
    private String direccion;
    private TipoMoneda moneda;
    private Integer maxComprasTickets;
    private Integer idUsuario; //organizador

    @JsonProperty("ciudad")
    private CiudadDTO ciudadDTO;

    @JsonProperty("categoria")
    private CategoriaEventoDTO categoriaDTO;

    public EventoDTO(Evento evento){
        this.idEvento = evento.getIdEvento();
        this.nombre = evento.getNombre();
        this.descripcion = evento.getDescripcion();
        this.informaAdic = evento.getInformAdic();
        this.restricciones = evento.getRestricciones();
        this.urlImagen = evento.getUrlImagen();
        this.urlMapa = evento.getUrlMapa();
        this.direccion = evento.getUrlMapa();
        this.moneda = evento.getMoneda();
        this.maxComprasTickets = evento.getMaxComprasTickets();
        this.idUsuario = evento.getOrganizador().getIdUsuario();
        this.ciudadDTO = new CiudadDTO(evento.getCiudad());
        this.categoriaDTO = new CategoriaEventoDTO(evento.getCategoria());
    }
}
