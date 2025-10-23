package com.guardianes.TuTicket.servicioPedidos.service;

import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import com.guardianes.TuTicket.servicioPedidos.repo.DetalleCompraRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleCompraService {

    @Autowired
    private DetalleCompraRepo repo;

    public DetalleCompra addDetalleCompra(DetalleCompra detalle) {
        return repo.save(detalle);
    }

    public List<DetalleCompra> getAllDetalles() {
        return repo.findAll();
    }

    public DetalleCompra getDetalleById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public DetalleCompra updateDetalleCompra(DetalleCompra detalle) {
        return repo.save(detalle);
    }

    public void deleteDetalleCompra(Integer id) {
        repo.deleteById(id);
    }

    public List<DetalleCompra> getDetallesByOrdenCompra(Integer idOrdenCompra) { return repo.findByOrdenCompraIdOrdenCompra(idOrdenCompra); }
}
