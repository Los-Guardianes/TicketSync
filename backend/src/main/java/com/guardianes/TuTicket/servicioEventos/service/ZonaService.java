package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.ZonaDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.Zona;
import com.guardianes.TuTicket.servicioEventos.repo.ZonaRepo;
import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class ZonaService {

    private final ZonaRepo repo;

    public Zona addZona(Zona zona) {
        return repo.save(zona);
    }

    public List<Zona> getAllZonas() {
        return repo.findAll();
    }

    public Zona getZonaById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Zona updateZona(Zona zona) {
        return repo.save(zona);
    }

    public void deleteZona(Integer id) {
        repo.deleteById(id);
    }

    public List<Zona> getZonasByEventId(Integer id_evento) {
        Evento evento = new Evento();
        evento.setIdEvento(id_evento);
        return repo.findByEvento(evento);
    }

    public List<Zona> addListaZonas(List<ZonaDTO> zonasDTO, Evento evento) {
        List<Zona> zonas = zonasDTO.stream()
                .map(zDTO -> {
                    return zDTO.toModel(evento);
                })
            .toList();
        List<Zona> zonasGuardadas = repo.saveAll(zonas);

        return zonasGuardadas;
    }

}
