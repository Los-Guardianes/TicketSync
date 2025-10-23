package com.guardianes.TuTicket.servicioPedidos.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.guardianes.TuTicket.servicioEventos.model.Funcion;
import com.guardianes.TuTicket.servicioPedidos.DTO.DetalleCompraDTO;
import com.guardianes.TuTicket.servicioPedidos.DTO.OrdenCompraDTO;
import com.guardianes.TuTicket.servicioPedidos.model.DetalleCompra;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import com.guardianes.TuTicket.servicioPedidos.repo.DetalleCompraRepo;
import com.guardianes.TuTicket.servicioPedidos.repo.OrdenCompraRepo;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class OrdenCompraService {

    private final OrdenCompraRepo repo;
    private final DetalleCompraRepo repoDetalle;
    //private final EntradaRepo repoEntrada;

    @PersistenceContext
    private EntityManager entityManager;

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

        return new OrdenCompra();
        /* Cambiar
        // Crear referencias sin hacer SELECT (solo proxies con ID)
        Usuario usuario = entityManager.getReference(Usuario.class, ordenCompraDTO.getIdUsuario());
        Funcion funcion = entityManager.getReference(Funcion.class, ordenCompraDTO.getIdFuncion());

        // Crear la orden manualmente
        OrdenCompra ocRegister = new OrdenCompra();
        ocRegister.setFechaOrden(LocalDateTime.now());
        ocRegister.setMetodoPago(ordenCompraDTO.getMetodoPago());
        ocRegister.setUsuario(usuario);
        ocRegister.setFuncion(funcion);
        ocRegister.setActivo(true);

        OrdenCompra oc = repo.save(ocRegister);

        List<DetalleCompraDTO> detalleCompraDTOS = ordenCompraDTO.getDetallesCompras();
        for (DetalleCompraDTO dc : detalleCompraDTOS) {
            Optional<Entrada> e = repoEntrada.findByZona_IdZonaAndTemporada_IdTemporada(
                    dc.getIdZona(),
                    dc.getIdTemporada()
            );
            if(e.isPresent()){
                DetalleCompra detalle = new DetalleCompra(oc, e.get(), dc.getCantidad());
                repoDetalle.save(detalle);
            } else {
                throw new NotFoundException("No se encontró la entrada");
            }
        }
        return oc;
         */
    }
}