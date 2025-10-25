package com.guardianes.TuTicket.servicioUsuarios.DTO;

import com.guardianes.TuTicket.servicioUsuarios.model.Organizador;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrganizadorDTO extends UsuarioDTO {
    private String ruc;
    private String razonSocial;

    public OrganizadorDTO(Organizador organizador){
        super(organizador);
        this.ruc = organizador.getRuc();
        this.razonSocial = organizador.getRazonSocial();
    }
}
