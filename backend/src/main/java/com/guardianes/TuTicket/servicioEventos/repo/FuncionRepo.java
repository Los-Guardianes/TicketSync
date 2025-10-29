package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuncionRepo extends JpaRepository<Funcion, Integer> {
    List<Funcion> findByEventoOrderByFechaInicioAscHoraInicioAsc(Evento evento);
}
