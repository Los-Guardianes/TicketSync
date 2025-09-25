package com.guardianes.TuTicket.repo;

import com.guardianes.TuTicket.model.OrdenDeCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenCompraRepo extends JpaRepository<OrdenDeCompra, Integer> {
}
