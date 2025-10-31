package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.TarifaDTO;
import com.guardianes.TuTicket.servicioEventos.model.Tarifa;
import com.guardianes.TuTicket.servicioEventos.repo.TarifaRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TarifaService {

    private final TarifaRepo repo;

    public Tarifa addTarifa(Tarifa tarifa) {
        return repo.save(tarifa);
    }

    public Tarifa updateFuncion(Tarifa tarifa) {
        return repo.save(tarifa);
    }

    public void deleteFuncion(Integer id) {
        repo.deleteById(id);
    }

    public List<TarifaDTO> getTarifasByEvento(Integer idEvento) {

        List<Tarifa> tarifas = repo.findTarifasByEvento(idEvento);
        return tarifas.stream()
                .map(TarifaDTO::new) //parseando a TarifaDTO con un lambda
                .collect(Collectors.toList());
    }


}
