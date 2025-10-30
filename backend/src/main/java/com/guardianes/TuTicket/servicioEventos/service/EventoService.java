package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.EventoDTO;
import com.guardianes.TuTicket.servicioEventos.DTO.FuncionDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.repo.EventoRepo;
import com.guardianes.TuTicket.servicioEventos.repo.FuncionRepo;
import com.guardianes.TuTicket.servicioUsuarios.DTO.OrganizadorDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class EventoService {

    private final EventoRepo repo;
    private final FuncionService funcionService;

    public List<EventoDTO> getAllEventos() {
        List<Evento> eventos = repo.findAll();
        return eventos.stream().map(
                evento -> new EventoDTO(evento, funcionService.getFuncionByEvento(evento.getIdEvento()))
        ).collect(Collectors.toList());
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