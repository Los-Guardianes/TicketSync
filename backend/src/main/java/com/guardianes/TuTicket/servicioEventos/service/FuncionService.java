package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioEventos.repo.FuncionRepo;
import jdk.jfr.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class FuncionService {

    @Autowired
    private FuncionRepo repo;

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
}
