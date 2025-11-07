package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.Descuento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface DescuentoRepo extends JpaRepository<Descuento, Integer> {

    Optional<Descuento> findByCodigo(String codigo);

    List<Descuento> findByEvento_IdEventoAndActivoTrueOrderByFechaInicioAsc(Integer idEvento);
}
