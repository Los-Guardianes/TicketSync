package com.guardianes.TuTicket.servicioUsuarios.service;

import com.guardianes.TuTicket.servicioUsuarios.model.Admin;
import com.guardianes.TuTicket.servicioUsuarios.repo.AdminRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepo repo;

    public List<Admin> getAllAdministradores() {
        return repo.findAll();
    }

    public Admin getAdministradorById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Admin addAdministrador(Admin admin) {
        return repo.save(admin);
    }

    public Admin updateAdministrador(Admin admin) {
        return repo.save(admin);
    }

    public void deleteAdministrador(Integer id) {
        repo.deleteById(id);
    }
}
