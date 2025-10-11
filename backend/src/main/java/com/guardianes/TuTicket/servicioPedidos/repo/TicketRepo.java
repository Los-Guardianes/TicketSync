package com.guardianes.TuTicket.servicioPedidos.repo;

import com.guardianes.TuTicket.servicioPedidos.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepo extends JpaRepository<Ticket, Integer> {
    @Query("SELECT t FROM Ticket t " +
            "JOIN t.detalleCompra dc " +
            "JOIN dc.ordenCompra oc " +
            "JOIN oc.usuario u " +
            "WHERE u.idUsuario = :idUsuario")
    List<Ticket> findTicketsByUsuarioId(@Param("idUsuario") Integer idUsuario);
}
