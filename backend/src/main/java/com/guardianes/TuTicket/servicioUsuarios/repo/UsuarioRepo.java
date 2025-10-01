package com.guardianes.TuTicket.servicioUsuarios.repo;

import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepo extends JpaRepository<Usuario, Integer> {
}
