package com.guardianes.TuTicket.servicioEventos.DTO.in;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TipoEntradaCDTO {
    private String nombre;
    private String descripcion;
    private Integer idEvento;
}
