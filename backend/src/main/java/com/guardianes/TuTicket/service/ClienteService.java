package com.guardianes.TuTicket.service;

import com.guardianes.TuTicket.model.Cliente;
import com.guardianes.TuTicket.repo.ClienteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepo repo;

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
}