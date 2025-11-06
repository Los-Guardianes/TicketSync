package com.guardianes.TuTicket.servicioEventos.DTO.in;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class FuncionCDTO {
    // NO DEBE TENER ID
    private LocalDate fechaInicio; // "2025-12-20"
    private LocalDate fechaFin;
    private LocalTime horaInicio;  // "20:00"
    private LocalTime horaFin;
    private Integer idEvento;
}
