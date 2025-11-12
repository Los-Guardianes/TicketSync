package com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO;

import com.guardianes.TuTicket.servicioEventos.model.ZonaXFuncion;
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

    public ZonaXFuncionDTO(ZonaXFuncion zf) {
        this.idZona = zf.getZona().getIdZona();
        this.idFuncion = zf.getFuncion().getIdFuncion();
        this.comprasActuales = zf.getComprasActuales();
        this.activo = zf.getActivo();
    }
}
