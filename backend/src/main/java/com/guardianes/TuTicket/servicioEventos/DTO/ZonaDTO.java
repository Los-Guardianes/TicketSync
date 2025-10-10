package com.guardianes.TuTicket.servicioEventos.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ZonaDTO {
    private String nombre; // "Platinium", "Tribuna Occidente"
    private Integer numAsientos;
    // Este campo es la clave para enlazar. Usamos el NOMBRE del TipoEntradaDTO
    private String nombreTipoEntrada;
    // Getters y Setters
}
