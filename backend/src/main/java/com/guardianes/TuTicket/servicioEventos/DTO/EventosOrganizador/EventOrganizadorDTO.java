package com.guardianes.TuTicket.servicioEventos.DTO.EventosOrganizador;

import com.guardianes.TuTicket.servicioEventos.model.CategoriaEvento;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;

import java.time.LocalDate;
import java.util.List;

public class EventOrganizadorDTO {
    public Integer idEvento;
    public String nombre;
    public String direccion;
    public CategoriaEvento categoriaEvento; // CASCO
    public Ciudad ciudad; // CASCO
    public String urlImagen;
    public LocalDate fechaReferencia;
    public boolean esPasado;
    public List<FuncionOrganizadorDTO> funciones;

    public EventOrganizadorDTO(Evento e, LocalDate fechaReferencia, boolean esPasado, List<FuncionOrganizadorDTO> funciones) {
        this.idEvento = e.getIdEvento();
        this.nombre = e.getNombre();
        this.direccion = e.getDireccion();
        this.categoriaEvento = e.getCategoria(); // CASCO
        this.ciudad = e.getCiudad(); // CASCO
        this.urlImagen = e.getUrlImagen();
        this.fechaReferencia = fechaReferencia;
        this.esPasado = esPasado;
        this.funciones = funciones;
    }
}
