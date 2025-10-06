package com.guardianes.TuTicket.servicioUsuarios.service;

import com.guardianes.TuTicket.servicioUsuarios.DTO.LoginDTO;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import com.guardianes.TuTicket.servicioUsuarios.repo.UsuarioRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

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

    public Usuario  validarCredenciales(LoginDTO credenciales) throws UserPrincipalNotFoundException {
        Optional<Usuario> usuario = repo.findByemail(credenciales.getEmail());
        if (usuario.isPresent()) {
            return usuario.get();
        }else{
            throw new UserPrincipalNotFoundException("Credenciales no válidas");
        }
    }
}
