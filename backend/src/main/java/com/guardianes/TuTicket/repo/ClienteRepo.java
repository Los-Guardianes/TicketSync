package com.guardianes.TuTicket.repo;

import com.guardianes.TuTicket.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepo extends JpaRepository<Cliente, Integer> {
}
