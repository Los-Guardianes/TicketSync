package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.Descuento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface DescuentoRepo extends JpaRepository<Descuento, Integer> {

    Optional<Descuento> findByCodigo(String codigo);

    @Query("update Descuento d set d.cantidad = :cantidad where p.id = :id")
    Integer updateCantidad(@Param("cantidad") Integer cantidad, @Param("id") Integer id);


    public Optional<Descuento> findByCodigo(String codigo);

    List<Descuento> findByEvento_IdEventoAndActivoTrueOrderByFechaInicioAsc(Integer idEvento);
}
