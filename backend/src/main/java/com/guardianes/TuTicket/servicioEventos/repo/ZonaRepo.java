package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.Zona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZonaRepo extends JpaRepository<Zona, Integer> {
}
