package com.guardianes.TuTicket.servicioPedidos.service;

import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import com.guardianes.TuTicket.servicioPedidos.model.Ticket;
import com.guardianes.TuTicket.servicioPedidos.repo.TicketRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepo repo;

    public Ticket addTicket(Ticket ticket) {
        return repo.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return repo.findAll();
    }

    public Ticket getTicketById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Ticket updateTicket(Ticket ticket) {
        return repo.save(ticket);
    }

    public void deleteTicket(Integer id) {
        repo.deleteById(id);
    }

    public List<Ticket> getTicketsByIdUsuario(Integer id) { return repo.findTicketsByUsuarioId(id); }

    public void addTickets(DetalleCompra detalleCompra) {
        BigDecimal precioUnitario = detalleCompra.getTarifa().getPrecioBase();
        //faltarían los descuentos
        for(int i = 0; i < detalleCompra.getCantidad(); i++){
            repo.save(new Ticket(
               null,
               false,
               "HASH_TEST",
               precioUnitario,
               null,
               true,
               detalleCompra
            ));
        }
    }
}
