package com.guardianes.TuTicket.servicioUsuarios.controller;

import com.guardianes.TuTicket.servicioUsuarios.model.Admin;
import com.guardianes.TuTicket.servicioUsuarios.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AdminController {

    @Autowired
    private AdminService service;

    @PostMapping("/admin")
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        try {
            Admin nuevo = service.addAdministrador(admin);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(service.getAllAdministradores());
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Integer id) {
        Admin admin = service.getAdministradorById(id);
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin no encontrado");
        }
        return ResponseEntity.ok(admin);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Integer id, @RequestBody Admin admin) {
        try {
            admin.setIdUsuario(id);
            Admin actualizado = service.updateAdministrador(admin);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Integer id) {
        try {
            service.deleteAdministrador(id);
            return ResponseEntity.ok("Admin eliminado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
