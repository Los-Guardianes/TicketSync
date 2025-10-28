package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.Evento;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoRepo extends JpaRepository<Evento, Integer> {

    @EntityGraph(attributePaths = {
            "ciudad",
            "categoria",
            "ciudad.dpto"
    })
    @Override
    List<Evento> findAll();
}
