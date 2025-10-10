package com.guardianes.TuTicket.servicioPedidos.repo;

import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleCompraRepo extends JpaRepository<DetalleCompra, Integer> {
    List<DetalleCompra> findByOrdenCompraIdOrdenCompra(Integer idOrdenCompra);
}
