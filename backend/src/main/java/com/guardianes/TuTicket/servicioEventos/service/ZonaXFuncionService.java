package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.model.ZonaXFuncion;
import com.guardianes.TuTicket.servicioEventos.model.ZonaXFuncionId;
import com.guardianes.TuTicket.servicioEventos.repo.ZonaXFuncionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ZonaXFuncionService {
    private final ZonaXFuncionRepo repo;

    public List<ZonaXFuncion> getAllZonaXFuncion() {
        return repo.findAll();
    }

    public ZonaXFuncion addZonaXFuncion(ZonaXFuncion zonaxfuncion) {
        return repo.save(zonaxfuncion);
    }

    public ZonaXFuncion updateZonaXFuncion(ZonaXFuncion zonaxfuncion) {
        return repo.save(zonaxfuncion);
    }

    public void deleteZonaXFuncion(ZonaXFuncionId  id) {
        repo.deleteById(id);
    }
}
