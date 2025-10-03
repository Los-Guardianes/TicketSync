package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.model.Temporada;
import com.guardianes.TuTicket.servicioEventos.repo.TemporadaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemporadaService {

    @Autowired
    private TemporadaRepo repo;

    public Temporada addTemporada(Temporada temporada) {
        return repo.save(temporada);
    }

    public List<Temporada> getAllTemporadas() {
        return repo.findAll();
    }

    public Temporada getTemporadaById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Temporada updateTemporada(Temporada temporada) {
        return repo.save(temporada);
    }

    public void deleteTemporada(Integer id) {
        repo.deleteById(id);
    }
}
