package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO.FuncionDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioEventos.repo.FuncionRepo;
import com.guardianes.TuTicket.servicioPedidos.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor

public class FuncionService {

    private final FuncionRepo repo;
    private final TicketService ticketService;

    public List<Funcion> getAllFunciones() {
        return repo.findAll();
    }

    public Funcion getFuncionById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Funcion addFuncion(Funcion funcion) {
        return repo.save(funcion);
    }

    public Funcion updateFuncion(Funcion funcion) {
        return repo.save(funcion);
    }

    public void deleteFuncion(Integer id) {
        repo.deleteById(id);
    }

    public List<Funcion> getFuncionByEvento(Integer idEvento) {
        Evento e = new Evento();
        e.setIdEvento(idEvento);
        return repo.findByEventoOrderByFechaInicioAscHoraInicioAsc(e);
    }

    public List<Funcion> addListFuncion(List<FuncionDTO> funcionDTO, Evento evento) {
        List<Funcion> funciones = funcionDTO.stream()
                .map(fncDTO -> {
                    return fncDTO.toModel(evento);
                })
                .toList();
        List<Funcion> funcionesGuardadas = repo.saveAll(funciones);
        // CAPAZ FALTA ALGO ()
        return funcionesGuardadas;
    }
}
