import { useState } from 'react';

export const useZonas = (eventData, updateEventData) => {
    const [modalZonaAbierto, setModalZonaAbierto] = useState(false);
    const [nuevaZona, setNuevaZona] = useState({ nombre: "", aforo: 0 });

    const abrirModalZona = () => {
        setNuevaZona({ nombre: "", aforo: 0 });
        setModalZonaAbierto(true);
    };

    const handleAgregarZona = () => {
        if (!nuevaZona.nombre || nuevaZona.aforo <= 0) {
            alert("Por favor completa todos los campos de la zona");
            return;
        }
        const nuevasZonas = [...eventData.zonas, { ...nuevaZona }];
        updateEventData({ zonas: nuevasZonas });
        setModalZonaAbierto(false);
        setNuevaZona({ nombre: "", aforo: 0 });
    };

    const eliminarZona = (index) => {
        const zonaAEliminar = eventData.zonas[index].nombre;
        const nuevasZonas = eventData.zonas.filter((_, i) => i !== index);
        const nuevasTarifas = (eventData.tarifas || []).filter(
            t => t.zona.nombre !== zonaAEliminar
        );
        updateEventData({ zonas: nuevasZonas, tarifas: nuevasTarifas });
    };

    return {
        modalZonaAbierto,
        nuevaZona,
        setNuevaZona,
        abrirModalZona,
        handleAgregarZona,
        eliminarZona,
        setModalZonaAbierto
    };
};