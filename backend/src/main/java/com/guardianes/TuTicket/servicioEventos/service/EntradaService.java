package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.model.Entrada;
import com.guardianes.TuTicket.servicioEventos.repo.EntradaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntradaService {

    @Autowired
    private EntradaRepo repo;

    public Entrada addEntrada(Entrada entrada) {
        return repo.save(entrada);
    }

    public List<Entrada> getAllEntradas() {
        return repo.findAll();
    }

    public Entrada getEntradaById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Entrada updateEntrada(Entrada entrada) {
        return repo.save(entrada);
    }

    public void deleteEntrada(Integer id) {
        repo.deleteById(id);
    }
}
