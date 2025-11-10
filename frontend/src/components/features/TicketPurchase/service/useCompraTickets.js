import { useEffect, useState } from "react";

export const useCompraTickets = (periodo, descuentoCodigo, tarifas) => {
    const [listaDetalles, setListaDetalles] = useState([]); // {tarifa, cantidad, precioDetalle}

    const [totalBruto, setTotalBruto] = useState(0);
    const [montoDescuentoPeriodo, setMontoDescuentoPeriodo] = useState(0);
    const [montoDescuentoCodigo, setMontoDescuentoCodigo] = useState(0);    
    const [total, setTotal] = useState(0);

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

    useEffect(()=>{
        console.log(tarifas)
        if(tarifas && tarifas.length > 0){
            
            const detallesIniciales = tarifas.map(t => ({
                tarifa: {...t}, //copiar toda la tarifa para evitar asignar el mismo puntero!!!!
                cantidad: 0,
                precioDetalle: 0
            }))
            console.log(detallesIniciales)
            setListaDetalles(detallesIniciales)
        }
    },[tarifas])

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

    const buscarDetallePorTarifa = (idTarifa) => {
        return listaDetalles.find(
            detalle => 
            detalle.tarifa.idTarifa === idTarifa
        );
    }
    /*
    const handleAddDetalle = (setNotification) => {
        if (!selectedZona || !selectedTipoEntrada || !selectedFuncion) {
            setNotification({
                message: "Selecciona una zona, un tipo de entrada y una función antes de agregar.",
                type: "warning",
            });
            return;
        }
        const selectedTarifa = obtenerTarifa(tarifas)
        if (!selectedTarifa) {
            setNotification({
                message: "No se encontró una tarifa para la combinación seleccionada de zona y tipo de entrada.",
                type: "error",
            });
            return;
        }
        addDetalle(selectedTarifa);         
    };
    */

    /*
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
    */


    return {
        listaDetalles,
        totalBruto,        
        montoDescuentoPeriodo,        
        montoDescuentoCodigo,    
        total,
        updateCantidad,
    }
}