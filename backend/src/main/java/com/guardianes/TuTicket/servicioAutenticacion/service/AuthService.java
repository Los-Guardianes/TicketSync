package com.guardianes.TuTicket.servicioAutenticacion.service;

import com.guardianes.TuTicket.servicioUsuarios.DTO.in.LoginDTO;
import com.guardianes.TuTicket.servicioUsuarios.DTO.UsuarioBearerDTO;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final JWTService jwtService;

    public UsuarioBearerDTO verify(LoginDTO loginDTO) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(),
                        loginDTO.getPassword()
        ));
        if (auth.isAuthenticated()) {
            Usuario usuario = (Usuario) auth.getPrincipal();
            return new UsuarioBearerDTO(
                    jwtService.generateToken(usuario.getEmail(),usuario.getRol().toString()),
                    usuario.getIdUsuario(),
                    usuario.getEmail(),
                    usuario.getRol().toString(),
                    usuario.getNombre(),
                    usuario.getApellido()
            );
        }
        throw new UsernameNotFoundException("No se encontró al usuario con email: " + loginDTO.getEmail());
    }
}
