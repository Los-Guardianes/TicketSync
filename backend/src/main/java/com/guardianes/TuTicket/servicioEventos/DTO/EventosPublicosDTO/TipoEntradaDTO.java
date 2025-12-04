package com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO;

import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.TipoEntrada;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TipoEntradaDTO {
    private Integer idTipoEntrada;
    private String nombre;
    private String descripcion;
    private Integer idEvento;

    public TipoEntradaDTO(TipoEntrada tipoEntrada) {
        this.idTipoEntrada = tipoEntrada.getIdTipoEntrada();
        this.nombre = tipoEntrada.getNombre();
        this.descripcion = tipoEntrada.getDescripcion();
        this.idEvento = tipoEntrada.getEvento().getIdEvento();
    }

    public TipoEntrada toModel(Evento evento) {
        return new TipoEntrada(
                this.idTipoEntrada,
                this.nombre,
                this.descripcion,
                true,
                evento);
    }
}
