package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO.ZonaXFuncionDTO;
import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioEventos.model.Zona;
import com.guardianes.TuTicket.servicioEventos.model.ZonaXFuncion;
import com.guardianes.TuTicket.servicioEventos.model.ZonaXFuncionId;
import com.guardianes.TuTicket.servicioEventos.repo.ZonaXFuncionRepo;
import com.guardianes.TuTicket.servicioExepciones.RecursoNoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;

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

    public List<ZonaXFuncionDTO> getZonaXFuncionByEvento(Integer id) {
        List<ZonaXFuncion> zonaxfuncion = repo.getZonaXFuncionByIdEvento(id);
        return zonaxfuncion.stream().map(ZonaXFuncionDTO::new).toList();
    }

    public Boolean reservarEntradaEnZonaFuncion(Zona zona, Funcion funcion, Integer cantidadRequest){
        ZonaXFuncion zxf = verificarDisponibilidadZonaFuncion(zona,funcion,cantidadRequest);
        if(zxf==null)return false;
        zxf.setComprasActuales(zxf.getComprasActuales()+cantidadRequest);
        repo.save(zxf);
        return true;
    }

    private ZonaXFuncion verificarDisponibilidadZonaFuncion(Zona zona, Funcion funcion, Integer cantidadRequest){
        ZonaXFuncion zonaXFuncion = repo
                .findById_IdZonaAndId_IdFuncion(zona.getIdZona(), funcion.getIdFuncion())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró que una zona: " + zona.getNombre() +
                        " tenga entradas para la función " + funcion.getFechaInicio()
                ));
        if(cantidadRequest + zonaXFuncion.getComprasActuales() > zona.getAforo())return null;
        System.out.println(zona.getAforo());
        return zonaXFuncion;
    }
}
