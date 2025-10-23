package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.Tarifa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TarifaRepo extends JpaRepository<Tarifa, Integer> {
}
