package com.guardianes.TuTicket.service;

import com.guardianes.TuTicket.model.CatEvento;
import com.guardianes.TuTicket.repo.CatEventoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CatEventoService {

    @Autowired
    private CatEventoRepo repo;

    public List<CatEvento> getAllCategorias() {
        return repo.findAll();
    }

    public CatEvento getCategoriaById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public CatEvento addCategoria(CatEvento catEvento) {
        return repo.save(catEvento);
    }

    public CatEvento updateCategoria(CatEvento catEvento) {
        return repo.save(catEvento);
    }

    public void deleteCategoria(Integer id) {
        repo.deleteById(id);
    }
}
