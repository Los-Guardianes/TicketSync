package com.guardianes.TuTicket.servicioUbicacion.repo;

import com.guardianes.TuTicket.servicioUbicacion.model.Dpto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DptoRepo extends JpaRepository<Dpto, Integer> {
}
