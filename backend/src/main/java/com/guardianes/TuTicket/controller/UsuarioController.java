package com.guardianes.TuTicket.controller;

import com.guardianes.TuTicket.model.Usuario;
import com.guardianes.TuTicket.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

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
}
