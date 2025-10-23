package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.repo.EventoRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class EventoService {

    private final EventoRepo repo;

    public List<Evento> getAllEventos() {
        return repo.findAll();
    }

    public Evento getEventoById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Evento addEvento(Evento evento) {
        return repo.save(evento);
    }

    public Evento updateEvento(Evento evento) {
        return repo.save(evento);
    }

    public void deleteEvento(Integer id) {
        repo.deleteById(id);
    }
}