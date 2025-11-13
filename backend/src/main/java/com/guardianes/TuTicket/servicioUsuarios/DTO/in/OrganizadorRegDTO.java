package com.guardianes.TuTicket.servicioUsuarios.DTO.in;

import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import com.guardianes.TuTicket.servicioUsuarios.model.Organizador;
import lombok.Data;

@Data
public class OrganizadorRegDTO extends UsuarioRegDTO{
    private String ruc;
    private String razonSocial;

    public Organizador toModel(Ciudad ciudad) {
        Organizador organizador = new Organizador();
        organizador = (Organizador) super.toModel(organizador,ciudad);
        organizador.setRazonSocial(this.razonSocial);
        organizador.setRuc(this.ruc);
        return organizador;
    }
}
