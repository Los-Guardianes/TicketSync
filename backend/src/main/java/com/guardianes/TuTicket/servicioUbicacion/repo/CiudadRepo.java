package com.guardianes.TuTicket.servicioUbicacion.repo;

import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CiudadRepo extends JpaRepository<Ciudad, Integer> {
}

