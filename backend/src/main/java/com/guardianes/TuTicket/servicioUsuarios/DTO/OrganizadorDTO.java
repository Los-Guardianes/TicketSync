package com.guardianes.TuTicket.servicioUsuarios.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrganizadorDTO extends UsuarioDTO{
    private String ruc;
    private String razonSocial;
}
