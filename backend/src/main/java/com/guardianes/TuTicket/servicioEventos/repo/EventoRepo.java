package com.guardianes.TuTicket.servicioEventos.repo;

import com.guardianes.TuTicket.servicioEventos.model.Evento;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoRepo extends JpaRepository<Evento, Integer> {

    // Carga relaciones útiles para listados generales
    @EntityGraph(attributePaths = {
            "ciudad",
            "categoria",
            "ciudad.dpto"
    })
    @Override
    List<Evento> findAll();

    // Solo eventos del organizador logueado (útil para "Mis Eventos")
    // (Opcional) Puedes mantener el mismo EntityGraph si también necesitas esas relaciones aquí:
    @EntityGraph(attributePaths = {
            "ciudad",
            "categoria",
            "ciudad.dpto"
    })
    List<Evento> findByOrganizador_IdUsuario(Integer idUsuario);
}
