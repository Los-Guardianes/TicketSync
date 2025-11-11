package com.guardianes.TuTicket.servicioPedidos.DTO;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TicketDTO {
    private Integer idTicket;
    private ClienteDTO cliente;
    private DetalleCompraDTO detalleCompra;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ClienteDTO {
        private String nombre;
        private String documento;      // DNI o RUC (valor)
        private String tipoDocumento;  // "DNI" o "RUC"  <-- NUEVO
        private String tokenText;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DetalleCompraDTO {
        private Double precioUnitario;
        private ZonaDTO zona;
        private TipoEntradaDTO tipoEntrada;
        private OrdenCompraDTO ordenCompra;

        @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
        public static class ZonaDTO { private String nombre; }

        @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
        public static class TipoEntradaDTO { private String nombre; }

        @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
        public static class OrdenCompraDTO {
            private java.time.LocalDateTime fechaCompra; // para que el front derive fecha
            private String horaCompra;                   // HH:mm
            private String nroTransaccion;
            private String metodoPago;
            private FuncionDTO funcion;

            @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
            public static class FuncionDTO {
                private String fechaInicio; // ISO string
                private EventoDTO evento;

                @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
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
