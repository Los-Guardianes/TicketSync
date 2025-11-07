package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.TipoEntradaDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.TipoEntrada;
import com.guardianes.TuTicket.servicioEventos.repo.TipoEntradaRepo;
import com.guardianes.TuTicket.servicioPedidos.DTO.DetalleCompraDTO;
import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoEntradaService {

    private final TipoEntradaRepo repo;

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

    public List<TipoEntrada> getTipoEntradaByIdEvento(Integer idEvento) {
        Evento e = new Evento();
        e.setIdEvento(idEvento);
        return repo.findByEvento(e);
    }

    public List<TipoEntrada> addListaTipoEntrada(List<TipoEntradaDTO> tipoEntradaDTO, Evento e) {
        List<TipoEntrada> tipoEntradas = tipoEntradaDTO.stream()
                .map(teDTO -> {
                    return teDTO.toModel(e);
                })
                .toList();
        List<TipoEntrada> entradasGuardadas = repo.saveAll(tipoEntradas);
        return entradasGuardadas;
    }
}
