package com.guardianes.TuTicket.servicioPedidos.service;

import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import com.guardianes.TuTicket.servicioPedidos.model.Ticket;
import com.guardianes.TuTicket.servicioUsuarios.model.Rol;
import com.guardianes.TuTicket.servicioPedidos.repo.TicketRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.guardianes.TuTicket.servicioPedidos.DTO.TicketDTO;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepo repo;

    public Ticket addTicket(Ticket ticket) {
        return repo.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return repo.findAll();
    }

    public Ticket getTicketById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public Ticket updateTicket(Ticket ticket) {
        return repo.save(ticket);
    }

    public void deleteTicket(Integer id) {
        repo.deleteById(id);
    }

    public List<Ticket> getTicketsByIdUsuario(Integer id) { return repo.findTicketsByUsuarioId(id); }

    public void addTickets(DetalleCompra detalleCompra) {
        BigDecimal precioUnitario = detalleCompra.getTarifa().getPrecioBase();
        //faltarían los descuentos
        for(int i = 0; i < detalleCompra.getCantidad(); i++){
            repo.save(new Ticket(
               null,
               false,
               "HASH_TEST",
               precioUnitario,
               null,
               true,
               detalleCompra
            ));
        }
    }
    public List<TicketDTO> getTicketsDTOByUsuarioAndEvento(Integer idUsuario, Integer idEvento) {
        List<Ticket> list = repo.findByUsuarioAndEvento(idUsuario, idEvento);
        DateTimeFormatter HHmm = DateTimeFormatter.ofPattern("HH:mm");

        return list.stream().map(t -> {
            DetalleCompra dc = t.getDetalleCompra();
            OrdenCompra oc   = (dc != null) ? dc.getOrdenCompra() : null;

            // Evitamos imports problemáticos usando 'var'
            var funcion = (oc != null) ? oc.getFuncion() : null;   // tiene fechaInicio (DATE) y horaInicio (TIME)
            var evento  = (funcion != null) ? funcion.getEvento() : null;

            // -------- Cliente (desde usuario de la orden) --------
            String nombreCliente = null;
            String documento     = null;
            if (oc != null && oc.getUsuario() != null) {
                nombreCliente = oc.getUsuario().getNombre(); // si tu entidad se llama distinto, cámbialo aquí
                // DNI está en tabla cliente (no en usuario). Si tu mapeo tiene relación usuario->cliente, úsala:
                // documento = (oc.getUsuario().getCliente() != null) ? oc.getUsuario().getCliente().getDni() : null;
                // Si no, déjalo null o añade luego un join específico.
            }

            // -------- Precio unitario --------
            Double precioUnitario = 0.0;
            if (t.getPrecioUnitario() != null) {
                precioUnitario = t.getPrecioUnitario().doubleValue();
            } else if (dc != null && dc.getPrecioDetalle() != null) {
                precioUnitario = dc.getPrecioDetalle().doubleValue();
            } else if (dc != null && dc.getTarifa() != null && dc.getTarifa().getPrecioBase() != null) {
                precioUnitario = dc.getTarifa().getPrecioBase().doubleValue();
            }

            // -------- Fecha/hora de compra (usa fechaOrden) --------
            var fechaOrden = (oc != null) ? oc.getFechaOrden() : null; // TIMESTAMP
            String horaCompra = (fechaOrden != null) ? fechaOrden.toLocalTime().format(HHmm) : null;

            // -------- Fecha/hora de la función (DATE + TIME -> ISO) --------
            String fechaInicioISO = null;
            if (funcion != null && funcion.getFechaInicio() != null && funcion.getHoraInicio() != null) {
                fechaInicioISO = funcion.getFechaInicio().toString() + "T" + funcion.getHoraInicio().toString();
            } else if (funcion != null && funcion.getFechaInicio() != null) {
                fechaInicioISO = funcion.getFechaInicio().toString();
            }

            // -------- Zona / Tipo de entrada desde Tarifa --------
            String nombreZona = (dc != null && dc.getTarifa() != null && dc.getTarifa().getZona() != null)
                    ? dc.getTarifa().getZona().getNombre() : "Zona";
            String nombreTipo = (dc != null && dc.getTarifa() != null && dc.getTarifa().getTipoEntrada() != null)
                    ? dc.getTarifa().getTipoEntrada().getNombre() : "Entrada";

            return TicketDTO.builder()
                    .idTicket(t.getIdTicket())
                    .cliente(TicketDTO.ClienteDTO.builder()
                            .nombre(nombreCliente)
                            .documento(documento) // ver nota arriba
                            .build())
                    .detalleCompra(TicketDTO.DetalleCompraDTO.builder()
                            .precioUnitario(precioUnitario)
                            .zona(new TicketDTO.DetalleCompraDTO.ZonaDTO(nombreZona))
                            .tipoEntrada(new TicketDTO.DetalleCompraDTO.TipoEntradaDTO(nombreTipo))
                            .ordenCompra(TicketDTO.DetalleCompraDTO.OrdenCompraDTO.builder()
                                    .fechaCompra(fechaOrden)     // el front usa este nombre; le damos fechaOrden
                                    .horaCompra(horaCompra)
                                    .nroTransaccion(null)        // no existe en tu BD; si luego lo agregas, cámbialo aquí
                                    .metodoPago(oc != null ? oc.getMetodoPago() : null)
                                    .funcion(TicketDTO.DetalleCompraDTO.OrdenCompraDTO.FuncionDTO.builder()
                                            .fechaInicio(fechaInicioISO)
                                            .evento(TicketDTO.DetalleCompraDTO.OrdenCompraDTO.FuncionDTO.EventoDTO.builder()
                                                    .idEvento(evento != null ? evento.getIdEvento() : null)
                                                    .nombre(evento != null ? evento.getNombre() : null)
                                                    .direccion(evento != null ? evento.getDireccion() : null)
                                                    .urlImagen(evento != null ? evento.getUrlImagen() : null)
                                                    .build())
                                            .build())
                                    .build())
                            .build())
                    .build();
        }).collect(Collectors.toList());
    }

    //ojala sirva XD
    public List<TicketDTO> getTicketsDTOByEvento(Integer idEvento) {
        List<Ticket> tickets = repo.findByEvento(idEvento);

        return tickets.stream()
                .map(t -> {
                    DetalleCompra dc = t.getDetalleCompra();
                    OrdenCompra oc   = (dc != null) ? dc.getOrdenCompra() : null;

                    var funcion = (oc != null) ? oc.getFuncion() : null;
                    var evento  = (funcion != null) ? funcion.getEvento() : null;

                    String nombreCliente = null;
                    String documento     = null;
                    if (oc != null && oc.getUsuario() != null) {
                        nombreCliente = oc.getUsuario().getNombre();
                    }

                    Double precioUnitario = 0.0;
                    if (t.getPrecioUnitario() != null) {
                        precioUnitario = t.getPrecioUnitario().doubleValue();
                    } else if (dc != null && dc.getPrecioDetalle() != null) {
                        precioUnitario = dc.getPrecioDetalle().doubleValue();
                    } else if (dc != null && dc.getTarifa() != null && dc.getTarifa().getPrecioBase() != null) {
                        precioUnitario = dc.getTarifa().getPrecioBase().doubleValue();
                    }

                    var fechaOrden = (oc != null) ? oc.getFechaOrden() : null;
                    String horaCompra = (fechaOrden != null)
                            ? fechaOrden.toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm"))
                            : null;

                    String fechaInicioISO = null;
                    if (funcion != null && funcion.getFechaInicio() != null && funcion.getHoraInicio() != null) {
                        fechaInicioISO = funcion.getFechaInicio().toString() + "T" + funcion.getHoraInicio().toString();
                    } else if (funcion != null && funcion.getFechaInicio() != null) {
                        fechaInicioISO = funcion.getFechaInicio().toString();
                    }

                    String nombreZona = (dc != null && dc.getTarifa() != null && dc.getTarifa().getZona() != null)
                            ? dc.getTarifa().getZona().getNombre()
                            : "Zona";

                    String nombreTipo = (dc != null && dc.getTarifa() != null && dc.getTarifa().getTipoEntrada() != null)
                            ? dc.getTarifa().getTipoEntrada().getNombre()
                            : "Entrada";

                    return TicketDTO.builder()
                            .idTicket(t.getIdTicket())
                            .cliente(TicketDTO.ClienteDTO.builder()
                                    .nombre(nombreCliente)
                                    .documento(documento)
                                    .build())
                            .detalleCompra(TicketDTO.DetalleCompraDTO.builder()
                                    .precioUnitario(precioUnitario)
                                    .zona(new TicketDTO.DetalleCompraDTO.ZonaDTO(nombreZona))
                                    .tipoEntrada(new TicketDTO.DetalleCompraDTO.TipoEntradaDTO(nombreTipo))
                                    .ordenCompra(TicketDTO.DetalleCompraDTO.OrdenCompraDTO.builder()
                                            .fechaCompra(fechaOrden)
                                            .horaCompra(horaCompra)
                                            .nroTransaccion(null)
                                            .metodoPago(oc != null ? oc.getMetodoPago() : null)
                                            .funcion(TicketDTO.DetalleCompraDTO.OrdenCompraDTO.FuncionDTO.builder()
                                                    .fechaInicio(fechaInicioISO)
                                                    .evento(TicketDTO.DetalleCompraDTO.OrdenCompraDTO.FuncionDTO.EventoDTO.builder()
                                                            .idEvento(evento != null ? evento.getIdEvento() : null)
                                                            .nombre(evento != null ? evento.getNombre() : null)
                                                            .direccion(evento != null ? evento.getDireccion() : null)
                                                            .urlImagen(evento != null ? evento.getUrlImagen() : null)
                                                            .build())
                                                    .build())
                                            .build())
                                    .build())
                            .build();
                })
                .collect(Collectors.toList());
    }

}
