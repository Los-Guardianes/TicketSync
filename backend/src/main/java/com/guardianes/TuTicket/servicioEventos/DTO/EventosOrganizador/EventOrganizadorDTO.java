package com.guardianes.TuTicket.servicioEventos.DTO.EventosOrganizador;

import com.guardianes.TuTicket.servicioEventos.model.Evento;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.List;

public class EventOrganizadorDTO {
    public Integer idEvento;
    public String nombre;
    public String direccion;
    public String urlImagen;
    public LocalDate fechaReferencia;
    public boolean esPasado;
    public List<FuncionOrganizadorDTO> funciones;

    public EventOrganizadorDTO(Evento e, LocalDate fechaReferencia, boolean esPasado, List<FuncionOrganizadorDTO> funciones) {
        this.idEvento = e.getIdEvento();
        this.nombre = e.getNombre();
        this.direccion = e.getDireccion();
        this.urlImagen = e.getUrlImagen();
        this.fechaReferencia = fechaReferencia;
        this.esPasado = esPasado;
        this.funciones = funciones;
    }
}
