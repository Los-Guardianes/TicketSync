import { useEffect, useState } from "react";
import { getDescuentoByCodigo } from "../../../../globalServices/DescuentoService";

export const useCompraTickets = (periodo, idevento) => {
    const [listaDetalles, setListaDetalles] = useState([]); // {tarifa, cantidad, precioDetalle}

    const [totalBruto, setTotalBruto] = useState(0);
    const [montoDescuentoPeriodo, setMontoDescuentoPeriodo] = useState(0);
    const [montoDescuentoCodigo, setMontoDescuentoCodigo] = useState(0);
    const [descuentoCodigo, setDescuentoCodigo] = useState(null);
    const [total, setTotal] = useState(0);

    const buscarDetallePorTarifa = (idTarifa) => {
        return listaDetalles.find(
            detalle => 
            detalle.tarifa.idTarifa === idTarifa
        );
    }

    const getDescuentoId = () => {
        if (!descuentoCodigo)return null;
        return descuentoCodigo.idDescuento
    }

    const addDetalle = (tarifa) => {
        const detalle = buscarDetallePorTarifa(tarifa.idTarifa);
        if (detalle) {
            updateCantidad(tarifa.idTarifa, detalle.cantidad + 1);
            return;
        }
        const nuevoDetalle = {
            tarifa: tarifa,
            cantidad: 1,
            precioDetalle: tarifa.precioBase,
        };
        const nuevaLista = [...listaDetalles, nuevoDetalle];
        setListaDetalles(nuevaLista);
    }

    const updateCantidad = (idTarifa, nuevaCantidad) => {        
        const detalle = buscarDetallePorTarifa(idTarifa);
        if (!detalle) return; // No existe el detalle        
        const nuevaLista = listaDetalles.map(det => {
            if(det.tarifa.idTarifa !== idTarifa) return det;
            else{
                const nuevoPrecioDetalle = det.tarifa.precioBase * nuevaCantidad;
                return {
                    tarifa: det.tarifa,
                    cantidad: nuevaCantidad,
                    precioDetalle: nuevoPrecioDetalle
                };
            }
        });
        setListaDetalles(nuevaLista);
    };

    const removeDetalle = (idTarifa) => {        
        const detalleAEliminar = buscarDetallePorTarifa(idTarifa);
        if (!detalleAEliminar) return; // No existe        
        const nuevaLista = listaDetalles.filter(
            det => det.tarifa.idTarifa !== idTarifa
        );        
        setListaDetalles(nuevaLista);
    };

    const verificarDescuentoCodigo = async(codigo) => {
        const descuento = await getDescuentoByCodigo(codigo);        
        if(!descuento && descuento.idEvento != idevento)return null; //cambiar si es que después es un DTO        
        setDescuentoCodigo(descuento);
        return descuento;
    }

    const eliminarDescuento = () =>{
        setDescuentoCodigo(null)
    }

    useEffect(() => {
        if(!periodo)return;

        const nuevoTotalBruto = listaDetalles.reduce((acc, det) => acc + det.precioDetalle, 0);        
        const nuevoMontoDescuentoPeriodo = periodo.tipoDesc == 'MONTO' ? periodo.valorDescuento : periodo.valorDescuento/100 * nuevoTotalBruto;                        
        const nuevoMontoDescuentoCodigo = descuentoCodigo ? (descuentoCodigo.tipoDesc == 'MONTO' ? descuentoCodigo.valorDescuento : descuentoCodigo.valorDescuento/100 * nuevoTotalBruto) : 0

        setMontoDescuentoPeriodo(nuevoMontoDescuentoPeriodo)
        setMontoDescuentoCodigo(nuevoMontoDescuentoCodigo)
        setTotalBruto(nuevoTotalBruto);
        setTotal(nuevoTotalBruto - nuevoMontoDescuentoPeriodo - nuevoMontoDescuentoCodigo);        
    }, [listaDetalles, descuentoCodigo]);

    return {
        listaDetalles,
        totalBruto,        
        montoDescuentoPeriodo,        
        montoDescuentoCodigo,
        descuentoCodigo,    
        total,
        addDetalle,
        updateCantidad,
        removeDetalle,
        verificarDescuentoCodigo,
        getDescuentoId,
        eliminarDescuento
    }
}