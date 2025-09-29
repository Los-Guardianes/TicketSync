package com.guardianes.TuTicket.service;

import com.guardianes.TuTicket.model.Admin;
import com.guardianes.TuTicket.repo.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepo repo;

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
