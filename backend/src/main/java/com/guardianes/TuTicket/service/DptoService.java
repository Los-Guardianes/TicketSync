package com.guardianes.TuTicket.service;

import com.guardianes.TuTicket.model.Departamento;
import com.guardianes.TuTicket.repo.DptoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DptoService {

    @Autowired
    private DptoRepo repo;

    public List<Departamento> getAllDepartamentos() {
        return repo.findAll();
    }

    public Departamento getDepartamentoById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Departamento addDepartamento(Departamento departamento) {
        return repo.save(departamento);
    }

    public Departamento updateDepartamento(Departamento departamento) {
        return repo.save(departamento);
    }

    public void deleteDepartamento(Integer id) {
        repo.deleteById(id);
    }
}
