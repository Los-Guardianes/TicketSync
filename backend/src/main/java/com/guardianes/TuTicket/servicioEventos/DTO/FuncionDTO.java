package com.guardianes.TuTicket.servicioEventos.DTO;

import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class FuncionDTO {
    private String fechaInicio; // "2025-12-20"
    private String fechaFin;
    private String horaInicio;  // "20:00"
    private String horaFin;

    public Funcion toModel(Evento e) {
        return new Funcion(
                null,
                LocalDate.parse(this.fechaInicio),
                LocalDate.parse(this.fechaFin),
                LocalTime.parse(this.horaInicio),
                LocalTime.parse(this.horaFin),
                true,
                e
        );
    }
}
