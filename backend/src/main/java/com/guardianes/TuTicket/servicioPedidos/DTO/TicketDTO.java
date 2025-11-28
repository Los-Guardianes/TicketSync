package com.guardianes.TuTicket.servicioPedidos.DTO;

import com.guardianes.TuTicket.servicioPedidos.model.Ticket;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TicketDTO {
    private Integer idTicket;
    private Boolean usado;
    private String hashTicket;
    private BigDecimal precioUnitario;

    public TicketDTO(Ticket t){
        this.idTicket = t.getIdTicket();
        this.usado = t.getUsado();
        this.hashTicket = t.getHashTicket();
        this.precioUnitario = t.getPrecioUnitario();
    }
}
