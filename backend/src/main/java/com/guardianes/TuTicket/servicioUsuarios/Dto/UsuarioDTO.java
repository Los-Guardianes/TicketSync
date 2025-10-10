package com.guardianes.TuTicket.servicioUsuarios.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioDTO {
    @com.fasterxml.jackson.annotation.JsonProperty("token")
    private String Bearer;
    private Integer idUsuario;
    private String email;
    private String rol;
    private String nombre;
    private String apellido;
}
