import { useState } from 'react';

export const useTemporadas = (eventData, updateEventData) => {
    const [temporadaActual, setTemporadaActual] = useState(0);
    const [modalTemporadaAbierto, setModalTemporadaAbierto] = useState(false);
    const [indiceEditando, setIndiceEditando] = useState(null);
    const [nuevaTemporada, setNuevaTemporada] = useState({
        nombre: "",
        tipoDesc: "MONTO",
        valorDescuento: 0,
        fechaInicio: "",
        fechaFin: "",
    });

    const abrirModalTemporada = (indice = null) => {
        const temporadas = eventData.temporadas || [];

        if (indice !== null) {
            // Modo edición - llenar nuevaTemporada con los datos existentes
            const temporadaAEditar = temporadas[indice];
            setNuevaTemporada({
                nombre: temporadaAEditar?.nombre || "",
                tipoDesc: temporadaAEditar?.tipoDesc || "MONTO",
                valorDescuento: temporadaAEditar?.valorDescuento || 0,
                fechaInicio: temporadaAEditar?.fechaInicio || "",
                fechaFin: temporadaAEditar?.fechaFin || "",
            });
            setIndiceEditando(indice);
        } else {
            // Modo creación - resetear nuevaTemporada
            setNuevaTemporada({
                nombre: "",
                tipoDesc: "MONTO",
                valorDescuento: 0,
                fechaInicio: "",
                fechaFin: "",
            });
            setIndiceEditando(null);
        }
        setModalTemporadaAbierto(true);
    };

    const handleAgregarTemporada = () => {
        if (!nuevaTemporada.nombre.trim() || nuevaTemporada.tipoDesc.trim() === "" 
            || nuevaTemporada.valorDescuento === null || nuevaTemporada.valorDescuento < 0
            || !nuevaTemporada.fechaInicio.trim() || !nuevaTemporada.fechaFin.trim()) {
            alert("Por favor completa todos los campos de la temporada");
            return;
        }

        const temporadasActuales = eventData.temporadas || [];

        if (indiceEditando !== null) {
            // Modo edición
            const nuevasTemporadas = [...temporadasActuales];
            nuevasTemporadas[indiceEditando] = { ...nuevaTemporada };
            updateEventData({ temporadas: nuevasTemporadas });
        } else {
            // Modo creación
            const nuevasTemporadas = [...temporadasActuales, {...nuevaTemporada}];
            updateEventData({ temporadas: nuevasTemporadas });
        }
        
        setModalTemporadaAbierto(false);
        setNuevaTemporada({
            nombre: "",
            tipoDesc: "MONTO",
            valorDescuento: 0,
            fechaInicio: "",
            fechaFin: "",
        });
        setIndiceEditando(null);
    };

    const handleEliminarTemporada = (indice) => {
        const temporadasActuales = eventData.temporadas || [];
        
        const nuevasTemporadas = temporadasActuales.filter((_, i) => i !== indice);
        updateEventData({ temporadas: nuevasTemporadas });
        
        if (temporadaActual >= nuevasTemporadas.length) {
            setTemporadaActual(nuevasTemporadas.length - 1);
        }
    };

    const handleSeleccionarTemporada = (indice) => {
        setTemporadaActual(indice);
    };

    return {
        temporadaActual,
        modalTemporadaAbierto,
        nuevaTemporada,           
        setNuevaTemporada,        
        indiceEditando,
        abrirModalTemporada,
        handleAgregarTemporada,
        handleEliminarTemporada,
        handleSeleccionarTemporada,
        setModalTemporadaAbierto
    };
};