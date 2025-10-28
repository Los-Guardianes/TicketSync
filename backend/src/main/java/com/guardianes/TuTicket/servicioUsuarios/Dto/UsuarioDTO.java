package com.guardianes.TuTicket.servicioUsuarios.DTO;

import com.guardianes.TuTicket.servicioUbicacion.DTO.CiudadDTO;
import com.guardianes.TuTicket.servicioUsuarios.model.Rol;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsuarioDTO {
    private Integer idUsuario;
    private String nombre;
    private String apellido;
    private String email;
    private Boolean verificado;
    private String telefono;
    private Rol rol;
    private CiudadDTO ciudad;

    public UsuarioDTO(Usuario usuario) {
        this.idUsuario = usuario.getIdUsuario();
        this.nombre = usuario.getNombre();
        this.apellido = usuario.getApellido();
        this.email = usuario.getEmail();
        this.verificado = usuario.getVerificado();
        this.telefono = usuario.getTelefono();
        this.rol = usuario.getRol();
        this.ciudad = new CiudadDTO(usuario.getCiudad());
    }
}
