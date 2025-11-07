package com.guardianes.TuTicket.servicioPedidos.repo;

import com.guardianes.TuTicket.servicioPedidos.model.Ticket;
import org.springframework.data.jpa.repository.EntityGraph;
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


    @Query("""
        SELECT t
        FROM Ticket t
        JOIN t.detalleCompra dc
        JOIN dc.ordenCompra oc
        JOIN oc.funcion f
        JOIN f.evento e
        WHERE oc.usuario.idUsuario = :idUsuario
          AND e.idEvento = :idEvento
        ORDER BY f.fechaInicio ASC, t.idTicket ASC
    """)
    @EntityGraph(attributePaths = {
            "detalleCompra",
            "detalleCompra.ordenCompra",
            "detalleCompra.ordenCompra.funcion",
            "detalleCompra.ordenCompra.funcion.evento",
            "detalleCompra.tarifa",
            "detalleCompra.tarifa.zona",
            "detalleCompra.tarifa.tipoEntrada",
            "detalleCompra.ordenCompra.usuario"
    })
    List<Ticket> findByUsuarioAndEvento(@Param("idUsuario") Integer idUsuario,
                                        @Param("idEvento") Integer idEvento);
}


