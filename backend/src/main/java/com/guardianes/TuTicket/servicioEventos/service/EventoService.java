package com.guardianes.TuTicket.servicioEventos.service;

import com.guardianes.TuTicket.servicioEventos.DTO.EventosOrganizador.EventOrganizadorDTO;
import com.guardianes.TuTicket.servicioEventos.DTO.EventosOrganizador.FuncionOrganizadorDTO;
import com.guardianes.TuTicket.servicioEventos.DTO.EventosPublicosDTO.EventoDTO;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioEventos.repo.EventoRepo;
import com.guardianes.TuTicket.servicioExepciones.GenericException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class EventoService {

    private final EventoRepo repo;
    private final FuncionService funcionService;

    public List<EventoDTO> getAllEventos() {
        List<Evento> eventos = repo.findAll();
        return eventos.stream().map(
                evento -> new EventoDTO(evento, funcionService.getFuncionByEvento(evento.getIdEvento()))
        ).collect(Collectors.toList());
    }

    public Evento getEventoById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Evento addEvento(Evento evento) {
        return repo.save(evento);
    }

    //public Evento updateEvento(Evento evento) {
    //    return repo.save(evento);
    //}
    public Evento updateEvento(Evento datos) {

        // 1. Buscar el evento real
        Evento evento = repo.findById(datos.getIdEvento())
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        // 2. Actualizar SOLO los campos que tu formulario modifica
        evento.setNombre(datos.getNombre());
        evento.setInformAdic(datos.getInformAdic());
        evento.setRestricciones(datos.getRestricciones());
        evento.setDescripcion(datos.getDescripcion());

        if (datos.getCategoria() != null) {
            evento.setCategoria(datos.getCategoria());
        }

        // 3. Guardar
        return repo.save(evento);
    }

    public void deleteEvento(Integer id) {
        repo.deleteById(id);
    }

//    public List<EventOrganizadorDTO> getEventoDTOByIOrganizador(Integer idUsuario) {
//        try{
//            LocalDate hoy = LocalDate.now();
//            List<Evento> eventos = repo.findByOrganizador_IdUsuario(idUsuario);
//            return eventos.stream().map(ev -> {
//
//                List<Funcion> funcionesActivas =
//                        funcionService.getFuncionByEvento(ev.getIdEvento())
//                                .stream()
//                                .filter(f -> Boolean.TRUE.equals(f.getActivo()))
//                                .toList();
//                boolean anyFutureFunc = funcionesActivas
//                        .stream()
//                        .anyMatch(f -> !f.getFechaInicio().isBefore(hoy));
//                LocalDate fechaRef = funcionesActivas.stream()
//                        .map(Funcion::getFechaInicio)
//                        .filter(d -> anyFutureFunc != d.isBefore(hoy))
//                        .min(anyFutureFunc ? Comparator.naturalOrder() : Comparator.reverseOrder())
//                        .orElse(null);
//                List<FuncionOrganizadorDTO> funcionesFiltradas = funcionesActivas.stream().map(FuncionOrganizadorDTO::new).toList();
//                return new EventOrganizadorDTO(ev,fechaRef,!anyFutureFunc,funcionesFiltradas);
//            }).collect(Collectors.toList());
//        }catch (Exception e){
//            throw new GenericException("Error al listar eventos del organizador" + e.getMessage());
//        }
//
//    }

    public List<EventOrganizadorDTO> getEventoDTOByIOrganizador(Integer idUsuario) {
        try{
            LocalDate hoy = LocalDate.now();
            List<Evento> eventos = repo.findByOrganizador_IdUsuario(idUsuario);
            return eventos.stream().map(ev -> {

                List<Funcion> funcionesActivas =
                        funcionService.getFuncionByEvento(ev.getIdEvento())
                                .stream()
                                .filter(f -> Boolean.TRUE.equals(f.getActivo()))
                                .toList();
                boolean anyFutureFunc = funcionesActivas
                        .stream()
                        .anyMatch(f -> !f.getFechaInicio().isBefore(hoy));
                LocalDate fechaRef = funcionesActivas.stream()
                        .map(Funcion::getFechaInicio)
                        .filter(d -> anyFutureFunc != d.isBefore(hoy))
                        .min(anyFutureFunc ? Comparator.naturalOrder() : Comparator.reverseOrder())
                        .orElse(null);
                List<FuncionOrganizadorDTO> funcionesFiltradas = funcionesActivas.stream().map(FuncionOrganizadorDTO::new).toList();
                return new EventOrganizadorDTO(ev,fechaRef,!anyFutureFunc,funcionesFiltradas);
            }).collect(Collectors.toList());
        }catch (Exception e){
            throw new GenericException("Error al listar eventos del organizador" + e.getMessage());
        }

    }
}