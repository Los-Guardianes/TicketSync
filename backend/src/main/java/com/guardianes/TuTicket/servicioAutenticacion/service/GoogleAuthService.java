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
    // Inyecta repositorio de Usuarios
    private final UsuarioRepo usuarioRepository;

    // Inyecta JWTService existente (el impresor de carnets)
    private final JWTService jwtService;

    // Lee el Client ID desde application.properties
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Transactional // Es buena práctica para crear/actualizar un usuario
    public UsuarioBearerDTO processGoogleToken(String idTokenString) throws GeneralSecurityException, IOException, RuntimeException {

        // Verifica que el token de Google es auténtico
        GoogleIdToken idToken = verifyGoogleToken(idTokenString);
        if (idToken == null) {
            throw new RuntimeException("Token de Google inválido.");
        }

        // Extrae la información del token de Google
        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        // obtener la foto: String fotoUrl = (String) payload.get("picture");

        // VALIDA Y CREA (pregunta)
        // Busca al usuario por email en tu base de datos
        Optional<Usuario> optUsuario = usuarioRepository.findByEmail(email);

        if (optUsuario.isEmpty()) {
            throw new UsernameNotFoundException("No se encontró usuario con el email de Google: " + email + ". Por favor, regístrese primero.");
        }
        //  SÍ EXISTE
        Usuario usuario = optUsuario.get();

        // JWTService existente para crear un token
        String miPropioJwt = jwtService.generateToken(usuario.getEmail(), usuario.getRol().toString());

        // Devuelve el mismo DTO que tu AuthService normal
        return new UsuarioBearerDTO(
                miPropioJwt,
                usuario.getIdUsuario(),
                usuario.getEmail(),
                usuario.getRol().toString(),
                usuario.getNombre(),
                usuario.getApellido()
        );
    }

    /**
     * Helper para verificar el token de Google
     */
    private GoogleIdToken verifyGoogleToken(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        return verifier.verify(idTokenString);
    }
}
