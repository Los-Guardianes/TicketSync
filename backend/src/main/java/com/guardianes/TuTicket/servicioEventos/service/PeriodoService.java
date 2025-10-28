package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.Periodo;
import com.guardianes.TuTicket.servicioEventos.repo.PeriodoRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


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

    public List<Periodo> getPeriodoByEventId(Integer idEvento) {
        Evento e = new Evento();
        e.setIdEvento(idEvento);
        return repo.findByEvento(e);
    }
}
