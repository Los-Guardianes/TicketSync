package com.guardianes.TuTicket.servicioUsuarios.service;

import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import com.guardianes.TuTicket.servicioUsuarios.DTO.in.ClienteRegDTO;
import com.guardianes.TuTicket.servicioUsuarios.model.Cliente;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import com.guardianes.TuTicket.servicioUsuarios.repo.ClienteRepo;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepo repo;
    private final EntityManager em;
    public List<Cliente> getAllClientes() {
        return repo.findAll();
    }

    public Cliente getClienteById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Cliente addCliente(Cliente cliente) {
        return repo.save(cliente);
    }

    public Cliente updateCliente(Cliente cliente) {
        return repo.save(cliente);
    }

    public void deleteCliente(Integer id) {
        repo.deleteById(id);
    }

    public Cliente agregarCliente(ClienteRegDTO clienteRegDTO){
        Ciudad c = em.getReference(Ciudad.class, clienteRegDTO.getIdCiudad());
        Cliente nuevoUsuario = clienteRegDTO.toModel(c);
        return repo.save(nuevoUsuario);
    }
}