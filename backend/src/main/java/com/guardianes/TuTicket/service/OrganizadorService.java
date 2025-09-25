package com.guardianes.TuTicket.service;

import com.guardianes.TuTicket.model.Organizador;
import com.guardianes.TuTicket.repo.OrganizadorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizadorService {

    @Autowired
    private OrganizadorRepo repo;

    public List<Organizador> getAllOrganizadores() {
        return repo.findAll();
    }

    public Organizador getOrganizadorById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Organizador addOrganizador(Organizador organizador) {
        return repo.save(organizador);
    }

    public Organizador updateOrganizador(Organizador organizador) {
        return repo.save(organizador);
    }

    public void deleteOrganizador(Integer id) {
        repo.deleteById(id);
    }
}
