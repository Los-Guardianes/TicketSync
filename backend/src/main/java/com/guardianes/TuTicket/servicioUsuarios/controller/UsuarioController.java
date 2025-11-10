package com.guardianes.TuTicket.servicioUsuarios.controller;

import com.guardianes.TuTicket.servicioAutenticacion.GoogleDTO.GoogleAuthRequest;
import com.guardianes.TuTicket.servicioAutenticacion.service.AuthService;
import com.guardianes.TuTicket.servicioAutenticacion.service.GoogleAuthService;
import com.guardianes.TuTicket.servicioUsuarios.DTO.UsuarioBearerDTO;
import com.guardianes.TuTicket.servicioUsuarios.DTO.in.LoginDTO;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import com.guardianes.TuTicket.servicioUsuarios.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService service;
    private final AuthService auth;
    private final GoogleAuthService googleAuthService;

    @PostMapping("/usuario")
    public ResponseEntity<?> addUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario nuevo = service.addUsuario(usuario);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/usuario")
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        List<Usuario> usuarios = service.getAllUsuarios();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<?> getUsuarioById(@PathVariable Integer id) {
        Usuario usuario = service.getUsuarioById(id);
        if (usuario == null) {
            return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(usuario, HttpStatus.OK);
    }

    @PutMapping("/usuario/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable Integer id, @RequestBody Usuario usuario) {
        Usuario usuario1 = null;
        try {
            usuario.setIdUsuario(id);
            Usuario actualizado = service.updateUsuario(usuario);
            return new ResponseEntity<>(actualizado, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/usuario/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable Integer id) {
        try {
            service.deleteUsuario(id);
            return new ResponseEntity<>("Usuario eliminado", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try{
            return ResponseEntity.ok(auth.verify(loginDTO));
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("message", "Email o contraseña incorrectos"), HttpStatus.UNAUTHORIZED);
        }
    }

    //Para google
    @PostMapping("/auth/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleAuthRequest request) {
        try {
            // Llama a tu nuevo servicio de Google
            UsuarioBearerDTO dto = googleAuthService.processGoogleToken(request.idToken());
            return ResponseEntity.ok(dto); // 200 OK

        } catch (UsernameNotFoundException e) {
            // Atrapa el error 404 si el usuario no existe
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No se encontró una cuenta con este email. Por favor, regístrese primero."));

        } catch (Exception e) {
            // Atrapa otros errores (ej. token de Google inválido)
            System.err.println("Error en Google Auth: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Error en la autenticación con Google."));
        }
    }
}
