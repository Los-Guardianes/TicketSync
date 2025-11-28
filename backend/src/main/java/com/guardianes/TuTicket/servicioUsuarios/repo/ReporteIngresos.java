package com.guardianes.TuTicket.servicioUsuarios.repo;

import com.guardianes.TuTicket.servicioUsuarios.DTO.out.ReporteIngresosDTO;
import com.guardianes.TuTicket.servicioPedidos.model.OrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReporteIngresos extends JpaRepository<OrdenCompra, Integer> {

    @Query(value = """
            SELECT 
                org.razonSocial AS "organizador",
                e.nombre AS "evento",
                SUM(t.precioUnitario) AS "totalVentasEvento", 
                COALESCE(cat.comision, pg.comisionGlobal) AS "porcentajeComision",
                ROUND(
                    (SUM(t.precioUnitario) * (COALESCE(cat.comision, pg.comisionGlobal) / 100)), 
                    2
                ) AS "gananciaPlataforma"
            
            -- AGREGAMOS 'tuticket.' ANTES DE CADA TABLA
            FROM tuticket.ticket t
                INNER JOIN tuticket.detalle_compra dc ON t.idDetalleCompra = dc.idDetalleCompra
                INNER JOIN tuticket.orden_compra oc ON dc.idOrdenCompra = oc.idOrdenCompra
                INNER JOIN tuticket.funcion f ON oc.idFuncion = f.idFuncion
                INNER JOIN tuticket.evento e ON f.idEvento = e.idEvento
                INNER JOIN tuticket.organizador org ON e.idUsuario = org.idUsuario
                INNER JOIN tuticket.categoria_evento cat ON e.idCategoria = cat.idCategoria
                CROSS JOIN tuticket.parametros_globales pg
            
            WHERE 
                oc.estado = 'ACEPTADA'
            
            GROUP BY 
                org.razonSocial, 
                e.nombre, 
                cat.comision, 
                pg.comisionGlobal
            
            ORDER BY 
                "gananciaPlataforma" DESC;
            """, nativeQuery = true)
    List<ReporteIngresosDTO> obtenerReporteIngresos();
}