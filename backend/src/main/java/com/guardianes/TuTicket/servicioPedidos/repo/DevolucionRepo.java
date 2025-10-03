package com.guardianes.TuTicket.servicioPedidos.repo;

import com.guardianes.TuTicket.servicioPedidos.model.Devolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DevolucionRepo extends JpaRepository<Devolucion, Integer> {
}
