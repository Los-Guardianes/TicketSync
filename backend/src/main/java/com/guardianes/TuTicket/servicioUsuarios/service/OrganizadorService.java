package com.guardianes.TuTicket.servicioUsuarios.service;

import com.guardianes.TuTicket.servicioUsuarios.model.Organizador;
import com.guardianes.TuTicket.servicioUsuarios.repo.OrganizadorRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizadorService {

    private final OrganizadorRepo repo;

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
