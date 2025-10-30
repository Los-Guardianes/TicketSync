package com.guardianes.TuTicket.servicioPedidos.DTO;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioPedidos.model.EstadoOrdenCompra;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;


import java.time.LocalDateTime;
import java.util.List;


@Data
@AllArgsConstructor
public class OrdenCompraDTO {
    private String metodoPago;
    private Integer idUsuario;
    private Integer idFuncion;

    List<DetalleCompraDTO> detallesCompras;

    public OrdenCompra toModel(Usuario u, Funcion f) {
        return new OrdenCompra(
                null,               //id como nulo
                LocalDateTime.now(),             //hora actual
                this.metodoPago,
                EstadoOrdenCompra.PENDIENTE,    //pendiente ya que se verificará conexión a la API
                true,                           //activo siempre true
                u,                              //usuario
                f                               //funcion
        );
    }
}
