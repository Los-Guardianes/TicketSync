package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO.PeriodoDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.Periodo;
import com.guardianes.TuTicket.servicioEventos.repo.PeriodoRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class PeriodoService {

    private final PeriodoRepo repo;

    public Periodo addPeriodo(Periodo temporada) {
        return repo.save(temporada);
    }

    public List<Periodo> getAllPeriodos() {
        return repo.findAll();
    }

    public Periodo getPeriodoById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Periodo updatePeriodo(Periodo temporada) {
        return repo.save(temporada);
    }

    public void deletePeriodo(Integer id) {
        repo.deleteById(id);
    }

    public List<PeriodoDTO> getPeriodoByEventId(Integer idEvento) {
        Evento e = new Evento();
        e.setIdEvento(idEvento);
        List<Periodo> periodos = repo.findByEvento(e);
        return periodos.stream().map(PeriodoDTO::new).collect(Collectors.toList());
    }
}
