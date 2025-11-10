package com.guardianes.TuTicket.servicioEventos.service;
import com.guardianes.TuTicket.servicioEventos.DTO.in.EventoCompletoDTO;
import com.guardianes.TuTicket.servicioEventos.model.*;
import com.guardianes.TuTicket.servicioEventos.repo.*;
import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import com.guardianes.TuTicket.servicioUbicacion.repo.CiudadRepo;
import com.guardianes.TuTicket.servicioUsuarios.model.Organizador;
import com.guardianes.TuTicket.servicioUsuarios.repo.OrganizadorRepo;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EventoCompletoService {

    private final EventoRepo repoEvento;
    private final FuncionRepo repoFuncion;
    private final PeriodoRepo repoTemporada;
    private final TipoEntradaRepo repoTipoEntrada;
    private final ZonaRepo repoZona; // <-- Repositorio para Zona
    private final ZonaXFuncionRepo repoZonaXFuncion; // <-- Repositorio para Zona
    private final TarifaRepo repoTarifa; // <-- Repositorio para Zona
    private final CiudadRepo repoCiudad;
    private final OrganizadorRepo repoOrganizador;
    private final CatEventoRepo repoCatEvento;
    private final EntityManager em;

    private final FuncionService funcionService;
    private final TarifaService tarifaService;
    private final PeriodoService periodoService;
    private final TipoEntradaService tipoEntradaService;
    private final ZonaService zonaService;

    @Transactional
    public Evento crearEventoCompleto(EventoCompletoDTO dto) {

        // --- 1. Crear y Guardar el Evento ---
        Evento evento = new Evento();
        evento.setNombre(dto.getNombre());
        evento.setDescripcion(dto.getDescripcion());
        evento.setInformAdic(dto.getInformAdic());
        evento.setRestricciones(dto.getRestricciones());
        evento.setUrlImagen(dto.getUrlImagen());
        evento.setUrlMapa(dto.getUrlMapa());
        evento.setDireccion(dto.getDireccion());
        evento.setMoneda(dto.getMoneda());
        evento.setMaxComprasTickets(dto.getMaxComprasTicket());
        // LOS QUE YA ESTAN CREADOS
        Organizador organizador = repoOrganizador.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Organizador no encontrado con ID: " + dto.getIdUsuario()));
        Ciudad ciudad = repoCiudad.findById(dto.getIdCiudad())
                .orElseThrow(() -> new RuntimeException("Ciudad no encontrada con ID: " + dto.getIdCiudad()));
        CategoriaEvento categoria = repoCatEvento.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + dto.getIdCategoria()));
        // LO SETTEA
        evento.setOrganizador(organizador);
        evento.setCiudad(ciudad);
        evento.setCategoria(categoria);
        // SETTEA EL ACTIVO
        evento.setActivo(true);

        Evento eventoGuardado = repoEvento.save(evento);
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // FUNCIONES
        dto.getFunciones().forEach(funcionDto -> {
            Funcion funcion = new Funcion();
            if (funcionDto.getFechaInicio() != null) {
//                funcion.setFechaInicio(LocalDate.parse(funcionDto.getFechaInicio(), dateFormatter));
                funcion.setFechaInicio(funcionDto.getFechaInicio());
            }
            if (funcionDto.getFechaFin() != null) {
//                funcion.setFechaFin(LocalDate.parse(funcionDto.getFechaFin(), dateFormatter));
                funcion.setFechaFin(funcionDto.getFechaFin());
            }

            // Para las horas, LocalTime.parse() suele ser más flexible, pero es bueno validar
            if (funcionDto.getHoraInicio() != null) {
//                funcion.setHoraInicio(LocalTime.parse(funcionDto.getHoraInicio()));
                funcion.setHoraInicio(funcionDto.getHoraInicio());
            }
            if (funcionDto.getHoraFin() != null) {
//                funcion.setHoraFin(LocalTime.parse(funcionDto.getHoraFin()));
                funcion.setHoraFin(funcionDto.getHoraFin());
            }
            funcion.setActivo(true);
            funcion.setEvento(eventoGuardado);
            repoFuncion.save(funcion);
        });
        // TEMPORADAS
        dto.getTemporadas().forEach(temporadaDto -> {
            Periodo temporada = new Periodo();
            temporada.setNombre(temporadaDto.getNombre());
            if (temporadaDto.getFechaInicio() != null) {
                temporada.setFechaInicio(temporadaDto.getFechaInicio());
            }
            if (temporadaDto.getFechaFin() != null) {
                temporada.setFechaFin(temporadaDto.getFechaFin());
            }
            temporada.setTipoDesc(temporadaDto.getTipoDesc());
            temporada.setValorDescuento(temporadaDto.getValorDescuento());
            temporada.setActivo(true);
            temporada.setEvento(eventoGuardado);
            repoTemporada.save(temporada);
        });
        // ZONAS
        Map<String, Zona> mapaZonas = new HashMap<>();
        dto.getZonas().forEach(zonasDto -> {
            Zona zona = new Zona();
            zona.setNombre(zonasDto.getNombre());
            zona.setAforo(zonasDto.getAforo());
            zona.setActivo(true);
            zona.setEvento(eventoGuardado); // Enlace con el Evento
            repoZona.save(zona);
            mapaZonas.put(zona.getNombre(), zona);
        });
        // ZONAS X FUNCION
        List<Zona> zonas =  repoZona.findByEvento(eventoGuardado);
        List<Funcion> funcs = repoFuncion.findByEventoOrderByFechaInicioAscHoraInicioAsc(eventoGuardado);
        List<ZonaXFuncion> links = new ArrayList<>();
        for (Zona z : zonas) {
            for (Funcion f : funcs) {
                ZonaXFuncionId id = new ZonaXFuncionId(z.getIdZona(), f.getIdFuncion());
                ZonaXFuncion link = new ZonaXFuncion(id, z, f, 0, true);
                repoZonaXFuncion.save(link);
            }
        }
        // TIPOS DE ENTRADA
        Map<String, TipoEntrada> mapaTipo = new HashMap<>();
        dto.getTiposDeEntrada().forEach(tipoDto -> {
            TipoEntrada tipoEntrada = new TipoEntrada();
            tipoEntrada.setNombre(tipoDto.getNombre());
            tipoEntrada.setDescripcion(tipoDto.getDescripcion());
            tipoEntrada.setActivo(true);
            tipoEntrada.setEvento(eventoGuardado); // Enlace con el Evento
            repoTipoEntrada.save(tipoEntrada);
            mapaTipo.put(tipoEntrada.getNombre(), tipoEntrada);
        });
        // TARIFA
        dto.getTarifas().forEach(tarifaDTO -> {
            Tarifa tarifa = new Tarifa();
            tarifa.setPrecioBase(tarifaDTO.getPrecioBase());
            tarifa.setActivo(true);
            // TIPO
            TipoEntrada tipoAsociado = mapaTipo.get(tarifaDTO.getTipoEntrada().getNombre());
            if (tipoAsociado == null) {
                throw new RuntimeException("El tipo de entrada '" + tarifaDTO.getTipoEntrada().getNombre() +
                        "' para la zona '" + tarifaDTO.getZona().getNombre() + "' no fue definido en la lista de tiposDeEntrada.");
            }
            // ZONA
            Zona zonaAsociada = mapaZonas.get(tarifaDTO.getZona().getNombre());
            if (zonaAsociada == null) {
                throw new RuntimeException("La zona '" + tarifaDTO.getZona().getNombre() +
                        "' para el tipo de entrada '" + tarifaDTO.getZona().getNombre() + "' no fue definido en la lista de tiposDeEntrada.");
            }
            tarifa.setZona(zonaAsociada);
            tarifa.setTipoEntrada(tipoAsociado);
            repoTarifa.save(tarifa);
        });


        return eventoGuardado;

        /* Cambiar a nueva forma
        evento.setNombre(dto.getNombre());
        evento.setDescripcion(dto.getDescripcion());
        evento.setInformAdic(dto.getInformAdic());
        evento.setRestricciones(dto.getRestricciones());
        evento.setDireccion(dto.getDireccion());
        // ... setear los demás campos del evento ...

        Ciudad ciudad = repoCiudad.findById(dto.getIdCiudad())
                .orElseThrow(() -> new RuntimeException("Ciudad no encontrada con ID: " + dto.getIdCiudad()));
        CategoriaEvento categoria = repoCatEvento.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + dto.getIdCategoria()));
        evento.setCiudad(ciudad);
        evento.setCategoria(categoria);
        evento.setActivo(true); // Por defecto, al crearlo está activo

        Evento eventoGuardado = repoEvento.save();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        // --- 2. Crear y Guardar las Funciones ---
        dto.getFunciones().forEach(funcionDto -> {
            Funcion funcion = new Funcion();
            if (funcionDto.getFechaInicio() != null && !funcionDto.getFechaInicio().isEmpty()) {
                funcion.setFechaInicio(LocalDate.parse(funcionDto.getFechaInicio(), dateFormatter));
            }
            if (funcionDto.getFechaFin() != null && !funcionDto.getFechaFin().isEmpty()) {
                funcion.setFechaFin(LocalDate.parse(funcionDto.getFechaFin(), dateFormatter));
            }

            // Para las horas, LocalTime.parse() suele ser más flexible, pero es bueno validar
            if (funcionDto.getHoraInicio() != null && !funcionDto.getHoraInicio().isEmpty()) {
                funcion.setHoraInicio(LocalTime.parse(funcionDto.getHoraInicio()));
            }
            if (funcionDto.getHoraFin() != null && !funcionDto.getHoraFin().isEmpty()) {
                funcion.setHoraFin(LocalTime.parse(funcionDto.getHoraFin()));
            }
            funcion.setActivo(true);
            funcion.setEvento(eventoGuardado);
            repoFuncion.save(funcion);
        });

        // --- 3. Crear y Guardar las Temporadas ---
        dto.getTemporadas().forEach(temporadaDto -> {
            Periodo temporada = new Periodo();
            temporada.setNombre(temporadaDto.getNombre());
            if (temporadaDto.getFechaInicio() != null && !temporadaDto.getFechaInicio().isEmpty()) {
                temporada.setFechaInicio(LocalDate.parse(temporadaDto.getFechaInicio(), dateFormatter));
            }
            if (temporadaDto.getFechaFin() != null && !temporadaDto.getFechaFin().isEmpty()) {
                temporada.setFechaFin(LocalDate.parse(temporadaDto.getFechaFin(), dateFormatter));
            }
            temporada.setPorcentajeDesc(temporadaDto.getPorcentajeDesc());
            temporada.setActivo(true);
            temporada.setEvento(eventoGuardado);
            repoTemporada.save(temporada);
        });

        // --- 4. Crear los Tipos de Entrada y guardarlos en un Mapa ---
        // El mapa nos ayudará a enlazar el TipoEntrada con la Zona por su nombre.
        Map<String, TipoEntrada> mapaTiposDeEntrada = new HashMap<>();
        dto.getTiposDeEntrada().forEach(tipoDto -> {
            TipoEntrada tipoEntrada = new TipoEntrada();
            tipoEntrada.setNombre(tipoDto.getNombre());
            tipoEntrada.setMoneda(tipoDto.getMoneda());
            tipoEntrada.setPrecioBase(tipoDto.getPrecioBase());
            tipoEntrada.setDescripcion(tipoDto.getDescripcion());
            tipoEntrada.setCantidadMax(tipoDto.getCantidadMax());
            tipoEntrada.setActivo(true);

            TipoEntrada tipoGuardado = repoTipoEntrada.save(tipoEntrada);
            mapaTiposDeEntrada.put(tipoGuardado.getNombre(), tipoGuardado);
        });

        // --- 5. Crear las Zonas y enlazarlas con el Evento y el TipoEntrada correspondiente ---
        dto.getZonas().forEach(zonaDto -> {
            Zona zona = new Zona();
            zona.setNombre(zonaDto.getNombre());
            zona.setNumAsientos(zonaDto.getNumAsientos());
            zona.setActivo(true);
            zona.setEvento(eventoGuardado); // Enlace con el Evento

            // Buscamos el TipoEntrada en el mapa usando el nombre que vino en el DTO
            TipoEntrada tipoAsociado = mapaTiposDeEntrada.get(zonaDto.getNombreTipoEntrada());
            if (tipoAsociado == null) {
                throw new RuntimeException("El tipo de entrada '" + zonaDto.getNombreTipoEntrada() + "' para la zona '" + zonaDto.getNombre() + "' no fue definido en la lista de tiposDeEntrada.");
            }
            zona.setTipoEntrada(tipoAsociado); // Enlace con el TipoEntrada

            repoZona.save(zona);
        });

        return eventoGuardado;



        Ciudad ci = em.getReference(Ciudad.class, dto.getIdCiudad());
        CategoriaEvento ca = em.getReference(CategoriaEvento.class, dto.getIdCategoria());
        Organizador o = em.getReference(Organizador.class, dto.getIdUsuario());
        Evento evento = dto.toModel(ci, ca, o);
        Evento eventoInsertado = repoEvento.save(evento);
        funcionService.addListFuncion(dto.getFunciones(), eventoInsertado);
        zonaService.addListaZonas(dto.getZonas(), eventoInsertado);
        tipoEntradaService.addListaTipoEntrada(dto.getTiposDeEntrada(), eventoInsertado);
        tarifaService.addListaTarifas(dto.getTarifas(), eventoInsertado);
        return evento;

         */
    }
}