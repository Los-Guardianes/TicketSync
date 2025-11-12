package com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO;

import com.guardianes.TuTicket.servicioEventos.model.CategoriaEvento;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class CategoriaEventoDTO {
    private Integer idCategoria;
    private String nombre;
    private BigDecimal comision;

    public CategoriaEventoDTO(CategoriaEvento categoriaEvento){
        this.idCategoria =  categoriaEvento.getIdCategoria();
        this.nombre = categoriaEvento.getNombre();
        this.comision = categoriaEvento.getComision();
    }
}
