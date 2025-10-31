package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.FuncionDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioEventos.model.Periodo;
import com.guardianes.TuTicket.servicioEventos.model.Tarifa;
import com.guardianes.TuTicket.servicioEventos.repo.FuncionRepo;
import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import com.guardianes.TuTicket.servicioPedidos.service.TicketService;
import jdk.jfr.Event;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

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
        return repo.findByEvento(e);
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
