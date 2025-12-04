package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.Tarifa;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TarifaRepo extends JpaRepository<Tarifa, Integer> {
        /*
         * //El entity grap sirve para que me traiga zona y tipoEntrada como EAGER,
         * evitando así llamadas a la BD
         * 
         * @EntityGraph(
         * attributePaths = {
         * "zona",
         * "tipoEntrada"
         * }
         * )
         */

        // También puede hacerse con
        @Query("select t from Tarifa t " +
                        "join fetch t.zona z " +
                        "join fetch t.tipoEntrada te " +
                        "where z.evento.idEvento = ?1 and te.evento.idEvento = ?1 ")
        List<Tarifa> findTarifasByEvento(@Param("idEvento") Integer idEvento);
}
