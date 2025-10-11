package com.guardianes.TuTicket.servicioUbicacion.service;

import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import com.guardianes.TuTicket.servicioUbicacion.repo.CiudadRepo;
import com.guardianes.TuTicket.servicioUbicacion.repo.DptoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CiudadService {



    @Autowired
    private CiudadRepo repo;

    @Autowired
    private DptoRepo repo2;

    public List<Ciudad> getAllCiudades() {
        return repo.findAll();
    }

    public Ciudad getCiudadById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Ciudad addCiudad(Ciudad ciudad) {
//        Integer idDpto = ciudad.getDepartamento().getIdDepartamento();
//        Departamento departamentoExistente = repo2.findById(idDpto)
//                .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));
//
//        ciudad.setDepartamento(departamentoExistente);
//        System.out.println(ciudad.getDepartamento().getIdDepartamento());
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
