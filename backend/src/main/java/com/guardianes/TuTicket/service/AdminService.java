package com.guardianes.TuTicket.service;

import com.guardianes.TuTicket.model.Administrador;
import com.guardianes.TuTicket.repo.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepo repo;

    public List<Administrador> getAllAdministradores() {
        return repo.findAll();
    }

    public Administrador getAdministradorById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Administrador addAdministrador(Administrador administrador) {
        return repo.save(administrador);
    }

    public Administrador updateAdministrador(Administrador administrador) {
        return repo.save(administrador);
    }

    public void deleteAdministrador(Integer id) {
        repo.deleteById(id);
    }
}
