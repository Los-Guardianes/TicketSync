package com.guardianes.TuTicket.repo;

import com.guardianes.TuTicket.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepo extends JpaRepository<Administrador, Integer> {
}