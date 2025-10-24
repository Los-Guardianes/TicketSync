package com.guardianes.TuTicket.servicioEventos.DTO;

import com.guardianes.TuTicket.servicioEventos.model.Zona;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ZonaDTO {
    private Integer idZona;
    private String nombre;
    private Integer comprasActuales;
    private Integer aforo;
    private Integer idEvento;

    public ZonaDTO(Zona zona) {
        this.idZona = zona.getIdZona();
        this.nombre = zona.getNombre();
        this.comprasActuales = zona.getComprasActuales();
        this.aforo = zona.getAforo();
        this.idZona = zona.getEvento().getIdEvento();
    }
}
