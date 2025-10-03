package com.guardianes.TuTicket.servicioPedidos.repo;

import com.guardianes.TuTicket.servicioPedidos.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepo extends JpaRepository<Ticket, Integer> {
}
