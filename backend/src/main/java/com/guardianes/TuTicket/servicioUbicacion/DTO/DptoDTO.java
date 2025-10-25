package com.guardianes.TuTicket.servicioUbicacion.DTO;

import com.guardianes.TuTicket.servicioUbicacion.model.Dpto;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DptoDTO {
    private Integer idDpto;
    private String nombre;

    public DptoDTO(Dpto dpto) {
        this.idDpto = dpto.getIdDpto();
        this.nombre = dpto.getNombre();
    }
}
