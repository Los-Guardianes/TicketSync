package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.EventoDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.repo.EventoRepo;
import com.guardianes.TuTicket.servicioUsuarios.DTO.OrganizadorDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class EventoService {

    private final EventoRepo repo;

    public List<EventoDTO> getAllEventos() {
        List<Evento> eventos = repo.findAll();
        return eventos.stream().map(EventoDTO::new).collect(Collectors.toList());
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