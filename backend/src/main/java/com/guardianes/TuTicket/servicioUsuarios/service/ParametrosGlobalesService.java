package com.guardianes.TuTicket.servicioUsuarios.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.guardianes.TuTicket.servicioUsuarios.model.ParametrosGlobales;
import com.guardianes.TuTicket.servicioUsuarios.repo.ParametrosGlobalesRepo;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParametrosGlobalesService {

    private final ParametrosGlobalesRepo repo;

    public List<ParametrosGlobales> getAllParametrosGlobales() {
        return repo.findAll();
    }

    public ParametrosGlobales getParametrosGlobalesById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public ParametrosGlobales updateParametrosGlobales(ParametrosGlobales params) {
        return repo.save(params);
    }
}
