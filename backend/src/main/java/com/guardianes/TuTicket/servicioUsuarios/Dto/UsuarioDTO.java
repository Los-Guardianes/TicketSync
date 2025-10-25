package com.guardianes.TuTicket.servicioUsuarios.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO {
    private String token;
    private Integer idUsuario;
    private String email;
    private String rol;
    private String nombre;
    private String apellido;
}
