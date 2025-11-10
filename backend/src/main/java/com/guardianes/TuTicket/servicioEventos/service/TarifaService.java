package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO.TarifaDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.Tarifa;
import com.guardianes.TuTicket.servicioEventos.model.TipoEntrada;
import com.guardianes.TuTicket.servicioEventos.model.Zona;
import com.guardianes.TuTicket.servicioEventos.repo.TarifaRepo;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TarifaService {

    private final TarifaRepo repo;
    private final EntityManager em;

    public Tarifa addTarifa(Tarifa tarifa) {
        return repo.save(tarifa);
    }

    public Tarifa updateFuncion(Tarifa tarifa) {
        return repo.save(tarifa);
    }

    public void deleteFuncion(Integer id) {
        repo.deleteById(id);
    }

    public List<TarifaDTO> getTarifasByEvento(Integer idEvento) {
        List<Tarifa> tarifas = repo.findTarifasByEvento(idEvento);
        return tarifas.stream()
                .map(TarifaDTO::new) //parseando a TarifaDTO con un lambda
                .collect(Collectors.toList());
    }

    public List<Tarifa> addListaTarifas(List<TarifaDTO> tarifasDTO, Evento evento) {
        List<Tarifa> tarifas = tarifasDTO.stream()
                .map(tDTO -> {
                    Zona zona = em.getReference(Zona.class, tDTO.getZonaDTO().getIdZona());
                    TipoEntrada tipoEntrada = em.getReference(TipoEntrada.class, tDTO.getTipoEntradaDTO().getIdTipoEntrada());
                    return tDTO.toModel(zona, tipoEntrada);
                })
                .toList();
        List<Tarifa> tarifasGuardadas = repo.saveAll(tarifas);
        return tarifasGuardadas;
    }

}
