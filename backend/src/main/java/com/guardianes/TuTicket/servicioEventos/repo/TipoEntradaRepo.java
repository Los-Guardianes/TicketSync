package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.TipoEntrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoEntradaRepo extends JpaRepository<TipoEntrada, Integer> {
}
