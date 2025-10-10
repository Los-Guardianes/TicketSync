package com.guardianes.TuTicket.servicioEventos.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FuncionDTO {
    private String fechaInicio; // "2025-12-20"
    private String fechaFin;
    private String horaInicio;  // "20:00"
    private String horaFin;
}
