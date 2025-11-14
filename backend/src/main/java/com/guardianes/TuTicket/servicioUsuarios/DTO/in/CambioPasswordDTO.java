package com.guardianes.TuTicket.servicioUsuarios.DTO.in;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CambioPasswordDTO {
    private Integer idUsuario;
    private String passwordActual;
    private String nuevaPassword;
}
