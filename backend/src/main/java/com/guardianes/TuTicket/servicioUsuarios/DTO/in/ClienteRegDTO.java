package com.guardianes.TuTicket.servicioUsuarios.DTO.in;

import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import com.guardianes.TuTicket.servicioUsuarios.model.Cliente;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ClienteRegDTO extends UsuarioRegDTO{
    private String dni  ;
    private LocalDate fechaNacimiento;

    public Cliente toModel(Ciudad ciudad) {
        Cliente cliente = new Cliente();
        cliente = (Cliente) super.toModel(cliente,ciudad);
        cliente.setDNI(this.dni);
        cliente.setFechaNacimiento(this.fechaNacimiento);
        return cliente;
    }
}
