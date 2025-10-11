package com.guardianes.TuTicket.servicioPedidos.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrdenCompraDTO {
    private String metodoPago;
    private Integer idUsuario;
    private Integer idFuncion;

    @JsonProperty("listaDetalles")  // ⬅️ MAPEA "listaDetalles" del JSON a "detallesCompras"
    List<DetalleCompraDTO> detallesCompras;
}
