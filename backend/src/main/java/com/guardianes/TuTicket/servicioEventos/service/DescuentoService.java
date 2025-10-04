package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.model.Descuento;
import com.guardianes.TuTicket.servicioEventos.repo.DescuentoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DescuentoService {

    @Autowired
    private DescuentoRepo repo;

    public List<Descuento> getAllDescuentos() {
        return repo.findAll();
    }

    public Descuento getDescuentoById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Descuento addDescuento(Descuento descuento) {
        return repo.save(descuento);
    }

    public Descuento updateDescuento(Descuento descuento) {
        return repo.save(descuento);
    }

    public void deleteDescuento(Integer id) {
        repo.deleteById(id);
    }
}

