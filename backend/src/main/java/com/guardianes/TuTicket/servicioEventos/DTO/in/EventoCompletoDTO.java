package com.guardianes.TuTicket.servicioEventos.DTO.in;

import com.guardianes.TuTicket.servicioEventos.DTO.*;
import com.guardianes.TuTicket.servicioEventos.model.CategoriaEvento;
import com.guardianes.TuTicket.servicioEventos.model.Evento;
import com.guardianes.TuTicket.servicioEventos.model.TipoMoneda;
import com.guardianes.TuTicket.servicioUbicacion.model.Ciudad;
import com.guardianes.TuTicket.servicioUsuarios.model.Organizador;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class EventoCompletoDTO {

    // CORREGIR GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    private String nombre;
    private String descripcion;
    private String informAdic;
    private String restricciones;
    private String urlImagen;
    private String urlMapa;
    private String direccion;
    private TipoMoneda moneda;
    private Integer maxComprasTicket;
    private Integer idCiudad;
    private Integer idCategoria;
    private Integer idUsuario;

    public Evento toModel(Ciudad ci, CategoriaEvento ca, Organizador o) {
        return new Evento(
                null,
                this.nombre,
                this.descripcion,
                this.informAdic,
                this.restricciones,
                this.urlImagen,
                this.urlMapa,
                this.direccion,
                this.moneda,
                this.maxComprasTicket,
                true,
                o,
                ci,
                ca
        );
    }

    /*
    * Crear nuevos dtos, en esta misma carpeta IN, ya que los DTOS de entrada no serán los mismos que los de salida
    * Recordar que se deben validar los datos ingresados -> no nulls si en la bd hay nulls
    private List<FuncionDTO> funciones;
    private List<ZonaDTO> zonas;              // <-- Lista de zonas que usan los tipos de entrada
    private List<TarifaDTO> tarifas;
    private List<PeriodoDTO> temporadas;
    private List<TipoEntradaDTO> tiposDeEntrada; // <-- Lista de tipos de entrada a crear
    private List<ZonaDTO> zonas;              // <-- Lista de zonas que usan los tipos de entrada

     */
}
