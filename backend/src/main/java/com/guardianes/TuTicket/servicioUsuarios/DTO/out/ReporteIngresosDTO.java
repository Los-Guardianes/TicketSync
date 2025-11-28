package com.guardianes.TuTicket.servicioUsuarios.DTO.out;

import java.math.BigDecimal;

// Esta interfaz le dice a Spring: "Espera recibir estas columnas de la query"
public interface ReporteIngresosDTO {
    String getOrganizador();
    String getEvento();
    BigDecimal getTotalVentasEvento();
    BigDecimal getPorcentajeComision();
    BigDecimal getGananciaPlataforma();
}