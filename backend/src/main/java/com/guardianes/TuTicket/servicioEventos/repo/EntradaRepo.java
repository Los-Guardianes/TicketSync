package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EntradaRepo extends JpaRepository<Entrada, Integer> {
    Optional<Entrada> findByZona_IdZonaAndTemporada_IdTemporada(Integer idZona, Integer idTemporada);
}
