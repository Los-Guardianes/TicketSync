package com.guardianes.TuTicket.servicioAutenticacion.service;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import com.guardianes.TuTicket.servicioUsuarios.DTO.UsuarioBearerDTO;
import com.guardianes.TuTicket.servicioUsuarios.model.Rol;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import com.guardianes.TuTicket.servicioUsuarios.repo.UsuarioRepo;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final UsuarioRepo usuarioRepository;
    private final JWTService jwtService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Transactional
    public UsuarioBearerDTO processGoogleToken(String idTokenString)
            throws GeneralSecurityException, IOException, RuntimeException {

        GoogleIdToken idToken = verifyGoogleToken(idTokenString);
        if (idToken == null) {
            throw new RuntimeException("Token de Google inválido.");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();

        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(email);

        if (optUsuario.isEmpty()) {
            throw new UsernameNotFoundException(
                    "No se encontró usuario con el email de Google: " + email + ". Por favor, regístrese primero."
            );
        }

        Usuario usuario = optUsuario.get();

        String miPropioJwt = jwtService.generateToken(
                usuario.getEmail(),
                usuario.getRol().toString()
        );

        String ciudad = null;
        String departamento = null;

        if (usuario.getCiudad() != null) {
            ciudad = usuario.getCiudad().getNombre();
            if (usuario.getCiudad().getDpto() != null) {
                departamento = usuario.getCiudad().getDpto().getNombre();
            }
        }

        // ---- Devolver DTO completo, igual que en AuthService.verify ----
        return new UsuarioBearerDTO(
                miPropioJwt,
                usuario.getIdUsuario(),
                usuario.getEmail(),
                usuario.getRol().toString(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getTelefono(),
                ciudad,
                departamento,
                usuario.getVerificado()
        );
    }

    private GoogleIdToken verifyGoogleToken(String idTokenString)
            throws GeneralSecurityException, IOException {

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                new GsonFactory()
        )
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        return verifier.verify(idTokenString);
    }
}