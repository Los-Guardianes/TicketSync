package com.guardianes.TuTicket.servicioPedidos.service;

import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioEventos.model.Periodo;
import com.guardianes.TuTicket.servicioEventos.model.Tarifa;
import com.guardianes.TuTicket.servicioEventos.model.ZonaXFuncion;
import com.guardianes.TuTicket.servicioEventos.repo.TarifaRepo;
import com.guardianes.TuTicket.servicioEventos.service.ZonaXFuncionService;
import com.guardianes.TuTicket.servicioExepciones.LogicaNegocioException;
import com.guardianes.TuTicket.servicioPedidos.DTO.DetalleCompraDTO;
import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import com.guardianes.TuTicket.servicioPedidos.repo.DetalleCompraRepo;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DetalleCompraService {

    private final DetalleCompraRepo repo;
    private final EntityManager em;
    private final TicketService ticketService;
    private final TarifaRepo tarifaRepo;
    private final ZonaXFuncionService zonaXFuncionService;

    public DetalleCompra addDetalleCompra(DetalleCompra detalle) {
        return repo.save(detalle);
    }

    public List<DetalleCompra> getAllDetalles() {
        return repo.findAll();
    }

    public DetalleCompra getDetalleById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public DetalleCompra updateDetalleCompra(DetalleCompra detalle) {
        return repo.save(detalle);
    }

    public void deleteDetalleCompra(Integer id) {
        repo.deleteById(id);
    }

    public List<DetalleCompra> getDetallesByOrdenCompra(Integer idOrdenCompra) { return repo.findByOrdenCompraIdOrdenCompra(idOrdenCompra); }

    public List<DetalleCompra> addListDetalles(List<DetalleCompraDTO> detallesDTO, OrdenCompra oc) {
        List<DetalleCompra> detalles = detallesDTO.stream()
                .map(dcDTO -> {
                    Tarifa tarifaRequest = tarifaRepo.getReferenceById(dcDTO.getIdTarifa());
                    if(!zonaXFuncionService.reservarEntradaEnZonaFuncion(tarifaRequest.getZona(),oc.getFuncion(),dcDTO.getCantidad())){
                        throw new LogicaNegocioException("No hay disponibilidad para la tarifa: " + tarifaRequest.getZona().getNombre() +
                                " y la función del " + oc.getFuncion().getFechaInicio());
                    }

                    Tarifa tarifa = em.getReference(Tarifa.class, dcDTO.getIdTarifa());
                    Periodo periodo = em.getReference(Periodo.class, dcDTO.getIdPeriodo());
                    return dcDTO.toModel(oc, tarifa, periodo);
                })
                .toList();
        List<DetalleCompra> detallesGuardados = repo.saveAll(detalles);
        detallesGuardados.forEach(ticketService::addTickets);

        return detallesGuardados;
    }
}
