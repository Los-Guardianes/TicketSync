package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.ZonaXFuncion;
import com.guardianes.TuTicket.servicioEventos.model.ZonaXFuncionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ZonaXFuncionRepo extends JpaRepository<ZonaXFuncion, ZonaXFuncionId> {
    @Query(
            "select zf from ZonaXFuncion zf " +
            "where zf.funcion.idFuncion in ( " +
                    "select f.idFuncion from Funcion f " +
                    "where f.evento.idEvento = ?1)"
    )
    List<ZonaXFuncion> getZonaXFuncionByIdEvento(@Param("idEvento") Integer idEvento);

    Optional<ZonaXFuncion> findById_IdZonaAndId_IdFuncion(Integer idZona, Integer idFuncion);
}
