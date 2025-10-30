package com.guardianes.TuTicket.servicioUbicacion.DTO;

import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CiudadDTO {
    private Integer idCiudad;
    private String nombre;
    private String codigoPostal;
    private DptoDTO dpto;

    public CiudadDTO(Ciudad ciudad){
        this.idCiudad = ciudad.getIdCiudad();
        this.nombre = ciudad.getNombre();
        this.codigoPostal = ciudad.getCodPostal();
        this.dpto = new DptoDTO(ciudad.getDpto());
    }
}
