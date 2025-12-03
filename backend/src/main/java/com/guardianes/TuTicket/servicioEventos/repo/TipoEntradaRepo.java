package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.TipoEntrada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TipoEntradaRepo extends JpaRepository<TipoEntrada, Integer> {
    List<TipoEntrada> findByEvento(Evento evento);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM tuticket.tarifa WHERE idTipoEntrada = :idTipoEntrada", nativeQuery = true)
    void deleteTarifasByTipoEntrada(@Param("idTipoEntrada") Integer idTipoEntrada);
}
