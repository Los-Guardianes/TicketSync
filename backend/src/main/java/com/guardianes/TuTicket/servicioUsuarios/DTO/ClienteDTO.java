package com.guardianes.TuTicket.servicioUsuarios.DTO;

import com.guardianes.TuTicket.servicioUsuarios.model.Cliente;
import com.guardianes.TuTicket.servicioUsuarios.model.Organizador;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;
@Data
@AllArgsConstructor
public class ClienteDTO extends  UsuarioDTO{
    private String DNI;
    private LocalDate fechaNacimiento;

    public ClienteDTO(Cliente cliente){
        super(cliente);
        this.DNI = cliente.getDNI();
        this.fechaNacimiento = cliente.getFechaNacimiento();
    }
}
