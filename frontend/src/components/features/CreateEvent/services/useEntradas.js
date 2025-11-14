import { useState } from 'react';

export const useEntradas = (eventData, updateEventData) => {
    const [entradaActual, setEntradaActual] = useState(0);
    const [modalTipoEntradaAbierto, setModalTipoEntradaAbierto] = useState(false);
    const [nuevoTipoEntrada, setNuevoTipoEntrada] = useState({ nombre: "", descripcion: ""});

    const addEntrada = () => {
        const nuevosTipos = [...eventData.tiposDeEntrada, { nombre: "", descripcion: ""}];
        updateEventData({ tiposDeEntrada: nuevosTipos });
        setEntradaActual(nuevosTipos.length - 1);
    };

    const eliminarTipoEntrada = (index) => {
        const tipoAEliminar = eventData.tiposDeEntrada[index].nombre;
        const nuevosTipos = eventData.tiposDeEntrada.filter((_, i) => i !== index);
        const nuevasTarifas = eventData.tarifas.filter(
        (t) => t.tipoEntrada.nombre !== tipoAEliminar
        );
        updateEventData({
        ...eventData,
        tiposDeEntrada: nuevosTipos,
        tarifas: nuevasTarifas,
        });
    };

    const abrirModalTipoEntrada = () => {
        setNuevoTipoEntrada({ nombre: "", descripcion: "" });
        setModalTipoEntradaAbierto(true);
    };

    const handleAgregarTipoEntrada = () => {
        if (!nuevoTipoEntrada.nombre || !nuevoTipoEntrada.descripcion) {
            alert("Por favor completa todos los campos del tipo de entrada");
            return;
        }
        const nuevosTipos = [...(eventData.tiposDeEntrada || []), { ...nuevoTipoEntrada }];
        updateEventData({ tiposDeEntrada: nuevosTipos });
        setModalTipoEntradaAbierto(false);
        setNuevoTipoEntrada({ nombre: "", descripcion: "" });
    };

    const handleAsignarPrecioZona = (tarifasArray, nombreTipoEntradaParam = null) => {
        // ✅ Ahora recibe un array de tarifas en lugar de parámetros individuales
        
        const nombreTipoEntrada = nombreTipoEntradaParam || 
                                eventData.tiposDeEntrada?.[entradaActual]?.nombre || 
                                "";

        if (!nombreTipoEntrada || nombreTipoEntrada.trim() === '') {
            alert('Debes ingresar un nombre para el tipo de entrada primero');
            return;
        }

        const tarifasActuales = eventData.tarifas || [];
        let nuevasTarifas = [...tarifasActuales];

        // ✅ Procesar todas las tarifas del array
        tarifasArray.forEach(tarifaData => {
            const { zona: nombreZona, precio, cantidad, idTarifa } = tarifaData;
            
            const precioNumerico = Number(precio);
            const cantidadNumerico = Number(cantidad);

            // Validar datos
            if (!nombreZona || !precio || precioNumerico <= 0 || !cantidad || cantidadNumerico <= 0) {
                console.warn('Tarifa inválida omitida:', tarifaData);
                return; // Continuar con la siguiente tarifa
            }

            // Buscar si ya existe una tarifa para esta combinación zona+tipo
            const indiceExistente = nuevasTarifas.findIndex(
                t => t.tipoEntrada.nombre === nombreTipoEntrada && 
                    t.zona.nombre === nombreZona
            );

            if (indiceExistente >= 0) {
                // Actualizar tarifa existente
                nuevasTarifas[indiceExistente] = {
                    ...nuevasTarifas[indiceExistente],
                    precioBase: precioNumerico,
                    cantidad: cantidadNumerico
                };
            } else {
                // ✅ CORREGIDO: Agregar nueva tarifa CON idTarifa
                const nuevaTarifa = {
                    precioBase: precioNumerico,
                    tipoEntrada: { nombre: nombreTipoEntrada },
                    zona: { nombre: nombreZona },
                    cantidad: cantidadNumerico,
                    idTarifa: idTarifa || Date.now() + Math.random() // ✅ AGREGAR idTarifa
                };
                nuevasTarifas.push(nuevaTarifa);
            }
        });

        // ✅ Actualizar el estado UNA sola vez con todas las tarifas
        updateEventData({ tarifas: nuevasTarifas });
        
        console.log('Tarifas actualizadas con IDs:', nuevasTarifas);
    };

    return {
        entradaActual,
        modalTipoEntradaAbierto,
        nuevoTipoEntrada,
        setNuevoTipoEntrada,
        addEntrada,
        eliminarTipoEntrada,
        abrirModalTipoEntrada,
        handleAgregarTipoEntrada,
        handleAsignarPrecioZona,
        setModalTipoEntradaAbierto
    };
};