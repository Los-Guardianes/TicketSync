package com.guardianes.TuTicket.servicioUsuarios.repo;

import com.guardianes.TuTicket.servicioUsuarios.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepo extends JpaRepository<Admin, Integer> {
}