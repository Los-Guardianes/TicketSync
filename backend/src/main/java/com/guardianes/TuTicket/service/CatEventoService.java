package com.guardianes.TuTicket.service;

import com.guardianes.TuTicket.model.CategoriaEvento;
import com.guardianes.TuTicket.repo.CatEventoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CatEventoService {

    @Autowired
    private CatEventoRepo repo;

    public List<CategoriaEvento> getAllCategorias() {
        return repo.findAll();
    }

    public CategoriaEvento getCategoriaById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public CategoriaEvento addCategoria(CategoriaEvento categoriaEvento) {
        return repo.save(categoriaEvento);
    }

    public CategoriaEvento updateCategoria(CategoriaEvento categoriaEvento) {
        return repo.save(categoriaEvento);
    }

    public void deleteCategoria(Integer id) {
        repo.deleteById(id);
    }
}
