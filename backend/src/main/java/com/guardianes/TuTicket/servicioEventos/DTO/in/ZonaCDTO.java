package com.guardianes.TuTicket.servicioEventos.DTO.in;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ZonaCDTO {
    private String nombre;
    private Integer aforo;
    private Integer idEvento;
}
