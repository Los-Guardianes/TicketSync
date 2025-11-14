import { useState } from 'react';

export const useEntradas = (eventData, updateEventData, currentMoneda) => {
    const [entradaActual, setEntradaActual] = useState(0);
    const [modalTipoEntradaAbierto, setModalTipoEntradaAbierto] = useState(false);
    const [nuevoTipoEntrada, setNuevoTipoEntrada] = useState({ nombre: "", tarifas: []});

    const currentTipoEntrada = eventData.tiposDeEntrada?.[entradaActual] || { nombre: "", tarifas: []};

    const addEntrada = () => {
        const nuevosTipos = [...eventData.tiposDeEntrada, { nombre: "", tarifas: []}];
        updateEventData({ tiposDeEntrada: nuevosTipos });
        setEntradaActual(nuevosTipos.length - 1);
    };

    const removeCurrentEntrada = () => {
        if (eventData.tiposDeEntrada.length <= 1) return;
        const nuevosTipos = eventData.tiposDeEntrada.filter((_, i) => i !== entradaActual);
        updateEventData({ tiposDeEntrada: nuevosTipos });
        if (entradaActual >= nuevosTipos.length) {
            setEntradaActual(nuevosTipos.length - 1);
        }
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

    const handleItemChange = (arrayName, index, field, value) => {
        const newArray = [...eventData[arrayName]];
        const isNumericField = ['valorDescuento'].includes(field);
        const finalValue = isNumericField ? Number(value) : value;
        newArray[index] = { ...newArray[index], [field]: finalValue };
        updateEventData({ [arrayName]: newArray });
    };

    const handleTipoNombreChange = (e) => {
        const newName = e.target.value;
        handleItemChange('tiposDeEntrada', entradaActual, 'nombre', newName);
    };

    const handleAsignarPrecioZona = (nombreZona, precio) => {
        const nombreTipoEntrada = currentTipoEntrada.nombre;

        if (!nombreTipoEntrada || nombreTipoEntrada.trim() === '') {
            alert('Debes ingresar un nombre para el tipo de entrada primero');
            return;
        }

        const precioNumerico = Number(precio);

        if (!precio || precioNumerico <= 0) {
            const nuevasTarifas = (eventData.tarifas || []).filter(
                t => !(t.tipoEntrada.nombre === nombreTipoEntrada && t.zona.nombre === nombreZona)
            );
            updateEventData({ tarifas: nuevasTarifas });
            return;
        }

        const tarifas = eventData.tarifas || [];
        const indiceExistente = tarifas.findIndex(
            t => t.tipoEntrada.nombre === nombreTipoEntrada && t.zona.nombre === nombreZona
        );

        if (indiceExistente >= 0) {
            const nuevasTarifas = [...tarifas];
            nuevasTarifas[indiceExistente] = {
                ...nuevasTarifas[indiceExistente],
                precioBase: precioNumerico
            };
            updateEventData({ tarifas: nuevasTarifas });
        } else {
            const nuevaTarifa = {
                precioBase: precioNumerico,
                tipoEntrada: { nombre: nombreTipoEntrada },
                zona: { nombre: nombreZona }
            };
            updateEventData({ tarifas: [...tarifas, nuevaTarifa] });
        }
    };

    const irEntradaIzq = () => setEntradaActual(p => (p === 0 ? eventData.tiposDeEntrada.length - 1 : p - 1));
    const irEntradaDer = () => setEntradaActual(p => (p === eventData.tiposDeEntrada.length - 1 ? 0 : p + 1));

    return {
        entradaActual,
        currentTipoEntrada,
        modalTipoEntradaAbierto,
        nuevoTipoEntrada,
        setNuevoTipoEntrada,
        addEntrada,
        removeCurrentEntrada,
        abrirModalTipoEntrada,
        handleAgregarTipoEntrada,
        handleTipoNombreChange,
        handleItemChange,
        handleAsignarPrecioZona,
        irEntradaIzq,
        irEntradaDer,
        setModalTipoEntradaAbierto
    };
};