package com.guardianes.TuTicket.servicioUsuarios.DTO.in;

import com.guardianes.TuTicket.servicioUbicacion.DTO.CiudadDTO;
import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import com.guardianes.TuTicket.servicioUsuarios.model.Rol;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import lombok.Data;


//Aquí y en las clases hijaos se podrían validar los atributos con @Valid
@Data
public class UsuarioRegDTO {
    private String nombre;
    private String apellido;
    private String email;
    private String hashCtr;
    private String telefono;
    private Rol rol;
    private Integer idCiudad;

    public Usuario toModel(Usuario usuario, Ciudad ciudad){
        usuario.setNombre(this.nombre);
        usuario.setApellido(this.apellido);
        usuario.setEmail(this.email);
        usuario.setHashCtr(this.hashCtr);
        usuario.setTelefono(this.telefono);
        usuario.setRol(this.rol);
        usuario.setCiudad(ciudad);
        return usuario;
    }
}
