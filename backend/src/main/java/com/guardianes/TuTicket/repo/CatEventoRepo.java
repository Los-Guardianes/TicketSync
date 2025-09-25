package com.guardianes.TuTicket.repo;

import com.guardianes.TuTicket.model.CategoriaEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CatEventoRepo extends JpaRepository<CategoriaEvento, Integer> {
}
