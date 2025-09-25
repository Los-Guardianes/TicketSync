package com.guardianes.TuTicket.repo;

import com.guardianes.TuTicket.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepo extends JpaRepository<Evento, Integer> {
}
