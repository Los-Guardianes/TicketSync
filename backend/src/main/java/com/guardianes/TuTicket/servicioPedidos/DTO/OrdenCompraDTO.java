package com.guardianes.TuTicket.servicioPedidos.DTO;

import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioPedidos.model.EstadoOrdenCompra;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Data
@AllArgsConstructor
public class OrdenCompraDTO {
    private String metodoPago;
    private BigDecimal totalBruto;
    private BigDecimal descuentoAplicado;
    private BigDecimal total;
    private Integer idUsuario;
    private Integer idFuncion;
    private Integer idDescuentoUtilizado;
    List<DetalleCompraDTO> detallesCompras;

    public OrdenCompra toModel(Usuario u, Funcion f) {
        return new OrdenCompra(
                null,               //id como nulo
                LocalDateTime.now(),             //hora actual
                this.metodoPago,
                EstadoOrdenCompra.PENDIENTE,    //pendiente ya que se verificará conexión a la API
                this.totalBruto,
                this.descuentoAplicado,
                this.total,
                true,                           //activo siempre true
                u,                              //usuario
                f                               //funcion
        );
    }
}
