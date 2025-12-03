package com.guardianes.TuTicket.servicioPedidos.DTO;

import com.guardianes.TuTicket.servicioPedidos.model.Ticket;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TicketDTO {
    private Integer idTicket;
    private Boolean usado;
    private String hashTicket;
    private BigDecimal precioUnitario;

    //Campos Nuevo (provicionales por ahora)
    private ClienteDTO cliente;
    private DetalleCompraDTO detalleCompra;


    public TicketDTO(Ticket t){
        this.idTicket = t.getIdTicket();
        this.usado = t.getUsado();
        this.hashTicket = t.getHashTicket();
        this.precioUnitario = t.getPrecioUnitario();
    }
    //Nuevo
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ClienteDTO {
        private String nombre;
        private String documento;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DetalleCompraDTO {
        private Double precioUnitario;
        private ZonaDTO zona;
        private TipoEntradaDTO tipoEntrada;
        private OrdenCompraDTO ordenCompra;

        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class ZonaDTO {
            private String nombre;
        }

        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class TipoEntradaDTO {
            private String nombre;
        }

        @Getter
        @Setter
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class OrdenCompraDTO {
            private LocalDateTime fechaCompra;
            private String horaCompra;
            private String nroTransaccion;
            private String metodoPago;
            private FuncionDTO funcion;

            @Getter
            @Setter
            @NoArgsConstructor
            @AllArgsConstructor
            @Builder
            public static class FuncionDTO {
                private String fechaInicio;
                private EventoDTO evento;

                @Getter
                @Setter
                @NoArgsConstructor
                @AllArgsConstructor
                @Builder
                public static class EventoDTO {
                    private Integer idEvento;
                    private String nombre;
                    private String direccion;
                    private String urlImagen;
                }
            }
        }
    }
}
