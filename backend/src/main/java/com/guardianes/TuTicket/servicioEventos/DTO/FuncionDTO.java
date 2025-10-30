package com.guardianes.TuTicket.servicioEventos.DTO;

import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class FuncionDTO {
    private Integer idFuncion;
    private LocalDate fechaInicio; // "2025-12-20"
    private LocalDate fechaFin;
    private LocalTime horaInicio;  // "20:00"
    private LocalTime horaFin;
    private Integer idEvento;

    public FuncionDTO(Funcion funcion){
        this.idFuncion = funcion.getIdFuncion();
        this.fechaInicio = funcion.getFechaInicio();
        this.fechaFin = funcion.getFechaFin();
        this.horaInicio = funcion.getHoraInicio();
        this.horaFin = funcion.getHoraFin();
        this.idEvento = funcion.getEvento().getIdEvento();
    }
}
