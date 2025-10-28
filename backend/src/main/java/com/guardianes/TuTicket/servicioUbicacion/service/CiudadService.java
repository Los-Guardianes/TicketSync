package com.guardianes.TuTicket.servicioUbicacion.service;

import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import com.guardianes.TuTicket.servicioUbicacion.repo.CiudadRepo;
import com.guardianes.TuTicket.servicioUbicacion.repo.DptoRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CiudadService {

    private final CiudadRepo repo;
    private final DptoRepo repo2;

    public List<Ciudad> getAllCiudades() {
        return repo.findAll();
    }

    public Ciudad getCiudadById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Ciudad addCiudad(Ciudad ciudad) {
        return repo.save(ciudad);
    }
    public Ciudad updateCiudad(Ciudad ciudad) {
        return repo.save(ciudad);
    }

    public void deleteCiudad(Integer id) {
        repo.deleteById(id);
    }

    public List<Ciudad> getCiudadesByDptoId(Integer idDpto) {
        return repo.findByDpto_IdDpto(idDpto);
    }
}
