package com.guardianes.TuTicket.servicioPedidos.service;

import com.guardianes.TuTicket.servicioPedidos.model.Devolucion;
import com.guardianes.TuTicket.servicioPedidos.repo.DevolucionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DevolucionService {

    @Autowired
    private DevolucionRepo repo;

    public Devolucion addDevolucion(Devolucion devolucion) {
        return repo.save(devolucion);
    }

    public List<Devolucion> getAllDevoluciones() {
        return repo.findAll();
    }

    public Devolucion getDevolucionById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Devolucion updateDevolucion(Devolucion devolucion) {
        return repo.save(devolucion);
    }

    public void deleteDevolucion(Integer id) {
        repo.deleteById(id);
    }
}
