package com.guardianes.TuTicket.servicioPedidos.service;

import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioEventos.service.DescuentoService;
import com.guardianes.TuTicket.servicioExepciones.LogicaNegocioException;
import com.guardianes.TuTicket.servicioPedidos.DTO.OrdenCompraDTO;
import com.guardianes.TuTicket.servicioPedidos.model.EstadoOrdenCompra;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import com.guardianes.TuTicket.servicioPedidos.repo.DetalleCompraRepo;
import com.guardianes.TuTicket.servicioPedidos.repo.OrdenCompraRepo;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManager;
import java.util.List;

@RequiredArgsConstructor
@Service
public class OrdenCompraService {

    private final OrdenCompraRepo repo;
    private final DetalleCompraRepo repoDetalle;
    private final DetalleCompraService detalleCompraService;
    private final DescuentoService descuentoService;
    private final EntityManager em;

    public List<OrdenCompra> getAllOrdenes() {
        return repo.findAll();
    }

    public OrdenCompra getOrdenById(Integer id) {
        return repo.findById(id).orElse(null);
    }

    public OrdenCompra addOrden(OrdenCompra ordenCompra) {
        return repo.save(ordenCompra);
    }

    public OrdenCompra updateOrden(OrdenCompra ordenCompra) {
        return repo.save(ordenCompra);
    }

    public void deleteOrden(Integer id) {
        repo.deleteById(id);
    }

    public OrdenCompra orquestarOrdenCompra(OrdenCompraDTO ordenCompraDTO) {
        Usuario u = em.getReference(Usuario.class, ordenCompraDTO.getIdUsuario());
        Funcion f = em.getReference(Funcion.class, ordenCompraDTO.getIdFuncion());
        OrdenCompra ordenCompra = ordenCompraDTO.toModel(u,f);
        OrdenCompra ocInsertada = repo.save(ordenCompra);
        simularApiPasarelaPagos(ocInsertada,true); //true -> siempre va funcionar
        detalleCompraService.addListDetalles(ordenCompraDTO.getDetallesCompras(), ocInsertada);

        return ocInsertada;
    }

    private void simularApiPasarelaPagos(OrdenCompra oc, Boolean pagoExitoso) {
        try {
            Thread.sleep(1000); // simula retardo de pasarela
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // buena práctica
            throw new LogicaNegocioException("Error al simular la pasarela de pagos");
        }
        if (!pagoExitoso) {
            oc.setEstado(EstadoOrdenCompra.CANCELADA);
            repo.save(oc);
            throw new LogicaNegocioException("La API no pudo completar el pago con la orden: " + oc.toString());
        }
        oc.setEstado(EstadoOrdenCompra.ACEPTADA);
        repo.save(oc);
    }

}