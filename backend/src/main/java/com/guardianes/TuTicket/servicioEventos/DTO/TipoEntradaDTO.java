package com.guardianes.TuTicket.servicioEventos.DTO;

import com.guardianes.TuTicket.servicioEventos.model.TipoEntrada;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TipoEntradaDTO {
    private Integer idTipoEntrada;
    private String nombre;
    private String descripcion;
    private Integer idEvento;

    public TipoEntradaDTO(TipoEntrada tipoEntrada){
        this.idTipoEntrada = tipoEntrada.getIdTipoEntrada();
        this.nombre = tipoEntrada.getNombre();
        this.descripcion = tipoEntrada.getDescripcion();
        this.idEvento = tipoEntrada.getEvento().getIdEvento();
    }
}
