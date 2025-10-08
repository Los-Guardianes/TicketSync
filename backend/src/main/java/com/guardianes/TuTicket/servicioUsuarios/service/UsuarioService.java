package com.guardianes.TuTicket.servicioUsuarios.service;

import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import com.guardianes.TuTicket.servicioUsuarios.repo.UsuarioRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepo repo;

    public List<Usuario> getAllUsuarios() {
        return repo.findAll();
    }

    public Usuario getUsuarioById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Usuario addUsuario(Usuario usuario) {
        return repo.save(usuario);
    }

    public Usuario updateUsuario(Usuario usuario) {
        return repo.save(usuario);
    }

    public void deleteUsuario(Integer id) {
        repo.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUsername(String email){
        Optional<Usuario> u = repo.findByEmail(email);
        if(u.isPresent()) {
            return u.get();
        }
        throw new UsernameNotFoundException("No se encontró al usuario con email: " + email);
    }
}
