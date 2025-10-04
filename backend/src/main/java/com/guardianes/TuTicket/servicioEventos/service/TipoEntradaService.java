package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.model.TipoEntrada;
import com.guardianes.TuTicket.servicioEventos.repo.TipoEntradaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoEntradaService {

    @Autowired
    private TipoEntradaRepo repo;

    public List<TipoEntrada> getAllTipoEntradas() {
        return repo.findAll();
    }

    public TipoEntrada getTipoEntradaById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public TipoEntrada addTipoEntrada(TipoEntrada tipoEntrada) {
        return repo.save(tipoEntrada);
    }

    public TipoEntrada updateTipoEntrada(TipoEntrada tipoEntrada) {
        return repo.save(tipoEntrada);
    }

    public void deleteTipoEntrada(Integer id) {
        repo.deleteById(id);
    }
}
