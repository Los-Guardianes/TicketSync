package com.guardianes.TuTicket.repo;

import com.guardianes.TuTicket.model.Dpto;
import com.guardianes.TuTicket.model.Dpto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DptoRepo extends JpaRepository<Dpto, Integer> {
}
