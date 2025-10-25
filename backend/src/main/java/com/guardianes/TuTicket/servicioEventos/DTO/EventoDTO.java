package com.guardianes.TuTicket.servicioEventos.DTO;

import com.guardianes.TuTicket.servicioEventos.model.TipoMoneda;
import com.guardianes.TuTicket.servicioUbicacion.DTO.CiudadDTO;
import com.guardianes.TuTicket.servicioUsuarios.DTO.OrganizadorDTO;

public class EventoDTO {
    private Integer idEvento;
    private String nombre;
    private String descripcion;
    private String informaAdic;
    private String restricciones;
    //URL IMG Y MAPA
    private String direccion;
    private TipoMoneda tipoMoneda;
    private Integer maxComprasTickets;
    private OrganizadorDTO organizadorDTO;
    private CiudadDTO ciudadDTO;
    private CategoriaEventoDTO categoriaDTO;
}
