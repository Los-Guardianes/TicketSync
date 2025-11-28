package com.guardianes.TuTicket.servicioPedidos.repo;

import com.guardianes.TuTicket.servicioPedidos.model.EstadoOrdenCompra;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import com.guardianes.TuTicket.servicioUsuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenCompraRepo extends JpaRepository<OrdenCompra, Integer> {
    @Query("select oc from OrdenCompra oc " +
            "where oc.funcion.idFuncion in (select f.idFuncion from Funcion f where f.evento.idEvento = ?2 )" +
            "and oc.usuario.idUsuario = ?1 " +
            "and oc.estado='ACEPTADA'")
    public List<OrdenCompra> findByUsuarioEvento(@Param("idUsuario") Integer idUsuario,
                                                 @Param("idEvento")Integer idEvento);

    @Query("select oc from OrdenCompra oc " +
            "where oc.funcion.idFuncion = ?1 " +
            "and oc.usuario.idUsuario=?2 "+
            "and oc.estado='ACEPTADA'")
    public List<OrdenCompra> findByUsuarioFuncion(@Param("idFuncion")Integer idFuncion,
                                                  @Param("idUsuario") Integer idUsuario);
}
