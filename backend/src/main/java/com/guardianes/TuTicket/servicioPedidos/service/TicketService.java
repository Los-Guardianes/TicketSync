package com.guardianes.TuTicket.servicioPedidos.service;

import com.guardianes.TuTicket.servicioPedidos.model.Ticket;
import com.guardianes.TuTicket.servicioPedidos.repo.TicketRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepo repo;

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
}
