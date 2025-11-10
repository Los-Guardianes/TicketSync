package com.guardianes.TuTicket.servicioEventos.DTO.EventosOrganizador;

import com.guardianes.TuTicket.servicioEventos.model.Funcion;

import java.time.LocalDate;

public class FuncionOrganizadorDTO {
    public Integer idFuncion;
    public LocalDate fechaInicio;
    public LocalDate fechaFin;
    public String horaInicio;
    public String horaFin;

    public FuncionOrganizadorDTO(Funcion f) {
        this.idFuncion = f.getIdFuncion();
        this.fechaInicio = f.getFechaInicio();
        this.fechaFin = f.getFechaFin();
        this.horaInicio = f.getHoraInicio() != null ? f.getHoraInicio().toString() : null;
        this.horaFin = f.getHoraFin() != null ? f.getHoraFin().toString() : null;
    }
}
