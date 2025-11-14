package com.guardianes.TuTicket.servicioUsuarios.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioBearerDTO {
    private String token;
    private Integer idUsuario;
    private String email;
    private String rol;
    private String nombre;
    private String apellido;
    private String telefono;
    private String ciudad;
    private String departamento;
}
