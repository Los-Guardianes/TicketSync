package com.guardianes.TuTicket.service;

import com.guardianes.TuTicket.model.OrdenDeCompra;
import com.guardianes.TuTicket.repo.OrdenCompraRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrdenCompraService {

    @Autowired
    private OrdenCompraRepo repo;

    public List<OrdenDeCompra> getAllOrdenes() {
        return repo.findAll();
    }

    public OrdenDeCompra getOrdenById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public OrdenDeCompra addOrden(OrdenDeCompra ordenDeCompra) {
        return repo.save(ordenDeCompra);
    }

    public OrdenDeCompra updateOrden(OrdenDeCompra ordenDeCompra) {
        return repo.save(ordenDeCompra);
    }

    public void deleteOrden(Integer id) {
        repo.deleteById(id);
    }
}
