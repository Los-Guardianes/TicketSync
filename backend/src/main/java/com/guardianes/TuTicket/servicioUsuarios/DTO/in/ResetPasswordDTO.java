package com.guardianes.TuTicket.servicioUsuarios.DTO.in;


import lombok.Data;

@Data
public class ResetPasswordDTO {
    private String token;
    private String newPassword;
}
