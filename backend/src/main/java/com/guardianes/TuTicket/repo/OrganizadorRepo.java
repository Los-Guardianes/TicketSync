package com.guardianes.TuTicket.repo;

import com.guardianes.TuTicket.model.Organizador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizadorRepo extends JpaRepository<Organizador, Integer> {
}
