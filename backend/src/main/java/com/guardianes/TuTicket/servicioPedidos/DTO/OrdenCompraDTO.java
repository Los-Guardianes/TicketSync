package com.guardianes.TuTicket.servicioPedidos.DTO;

import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
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
    private Integer idOrdenCompra;
    private String metodoPago;
    private BigDecimal totalBruto;
    private BigDecimal descuentoAplicado;
    private LocalDateTime fechaOrden;
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

    public OrdenCompraDTO(OrdenCompra oc, List<DetalleCompra> detallesEntidad) {
        this.idOrdenCompra = oc.getIdOrdenCompra();
        this.metodoPago = oc.getMetodoPago();
        this.totalBruto = oc.getTotalBruto();
        this.descuentoAplicado = oc.getDescuentoAplicado();
        this.total = oc.getTotal();
        this.idUsuario = oc.getUsuario().getIdUsuario();
        this.idFuncion = oc.getFuncion().getIdFuncion();
        this.fechaOrden = oc.getFechaOrden();
        if (detallesEntidad != null) {
            this.detallesCompras = detallesEntidad.stream()
                    .map(DetalleCompraDTO::new).toList();
        }
    }

    public void fusionar(OrdenCompraDTO otroDTO) {
        this.totalBruto = this.totalBruto.add(otroDTO.getTotalBruto());
        this.total = this.total.add(otroDTO.getTotal());
        if (otroDTO.getFechaOrden().isAfter(this.fechaOrden)) {
            this.fechaOrden = otroDTO.getFechaOrden();
        }
        for (DetalleCompraDTO nuevo : otroDTO.getDetallesCompras()) {
            fusionarUnDetalle(nuevo);
        }
    }

    private void fusionarUnDetalle(DetalleCompraDTO nuevo) {
        DetalleCompraDTO existente = this.detallesCompras.stream()
                .filter(d -> sonMismoTipo(d, nuevo))
                .findFirst()
                .orElse(null);

        if (existente != null) {
            existente.setCantidad(existente.getCantidad() + nuevo.getCantidad());
        } else {
            this.detallesCompras.add(nuevo);
        }
    }

    private boolean sonMismoTipo(DetalleCompraDTO a, DetalleCompraDTO b) {
        boolean mismaTarifa = (a.getIdTarifa() == null && b.getIdTarifa() == null) ||
                (a.getIdTarifa() != null && a.getIdTarifa().equals(b.getIdTarifa()));
        boolean mismoPeriodo = (a.getIdPeriodo() == null && b.getIdPeriodo() == null) ||
                (a.getIdPeriodo() != null && a.getIdPeriodo().equals(b.getIdPeriodo()));
        return mismaTarifa && mismoPeriodo;
    }
}
