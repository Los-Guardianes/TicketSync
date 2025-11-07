package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.model.CategoriaEvento;
import com.guardianes.TuTicket.servicioEventos.repo.CatEventoRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatEventoService {

    private final CatEventoRepo repo;

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
