package com.guardianes.TuTicket.servicioUbicacion.service;

import com.guardianes.TuTicket.servicioUbicacion.model.Dpto;
import com.guardianes.TuTicket.servicioUbicacion.repo.DptoRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DptoService {

    private final DptoRepo repo;

    public List<Dpto> getAllDptos() {
        return repo.findAll();
    }

    public Dpto getDptoById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Dpto addDpto(Dpto dpto) {
        return repo.save(dpto);
    }

    public Dpto updateDpto(Dpto dpto) {
        return repo.save(dpto);
    }

    public void deleteDpto(Integer id) {
        repo.deleteById(id);
    }
}
