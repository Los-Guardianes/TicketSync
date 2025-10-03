package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioEventos.repo.FuncionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
