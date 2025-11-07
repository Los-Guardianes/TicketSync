package com.guardianes.TuTicket.servicioEventos.DTO;

import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.Zona;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ZonaDTO {
    private Integer idZona;
    private String nombre;
    private Integer aforo;
    private Integer idEvento;

    public ZonaDTO(Zona zona) {
        this.idZona = zona.getIdZona();
        this.nombre = zona.getNombre();
        this.aforo = zona.getAforo();
        this.idEvento = zona.getEvento().getIdEvento();
    }

    public Zona toModel(Evento evento) {
        return new Zona(
                idZona,
                this.nombre,
                this.aforo,
                true,
                evento
        );
    }
}
