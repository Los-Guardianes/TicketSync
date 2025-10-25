package com.guardianes.TuTicket.servicioEventos.DTO.in;

import com.guardianes.TuTicket.servicioEventos.DTO.FuncionDTO;
import com.guardianes.TuTicket.servicioEventos.DTO.PeriodoDTO;
import com.guardianes.TuTicket.servicioEventos.DTO.TipoEntradaDTO;
import com.guardianes.TuTicket.servicioEventos.DTO.ZonaDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class EventoCompletoDTO {

    /// ////CORREGIR GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    private String nombre;
    private String descripcion;
    private String informAdic;
    private String restricciones;
    private String urlImagen;
    private String urlMapa;
    private String direccion;
    private Integer idCiudad;
    private Integer idCategoria;

    // Listas de entidades relacionadas
    private List<FuncionDTO> funciones;
    private List<PeriodoDTO> temporadas;
    private List<TipoEntradaDTO> tiposDeEntrada; // <-- Lista de tipos de entrada a crear
    private List<ZonaDTO> zonas;              // <-- Lista de zonas que usan los tipos de entrada
}
