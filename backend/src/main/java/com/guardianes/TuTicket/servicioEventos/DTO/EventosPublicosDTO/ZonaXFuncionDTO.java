package com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ZonaXFuncionDTO {
    private Integer idZona;
    private Integer idFuncion;
    private Integer comprasActuales;
    private Boolean activo;
}
