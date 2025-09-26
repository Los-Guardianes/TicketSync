package com.guardianes.TuTicket.service;

import com.guardianes.TuTicket.model.OrdenCompra;
import com.guardianes.TuTicket.repo.OrdenCompraRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrdenCompraService {

    @Autowired
    private OrdenCompraRepo repo;

    public List<OrdenCompra> getAllOrdenes() {
        return repo.findAll();
    }

    public OrdenCompra getOrdenById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public OrdenCompra addOrden(OrdenCompra ordenCompra) {
        return repo.save(ordenCompra);
    }

    public OrdenCompra updateOrden(OrdenCompra ordenCompra) {
        return repo.save(ordenCompra);
    }

    public void deleteOrden(Integer id) {
        repo.deleteById(id);
    }
}
