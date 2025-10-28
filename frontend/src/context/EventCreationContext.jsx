import React, { createContext, useState, useContext } from 'react';

// 1. Definimos el estado inicial que tendrá nuestro formulario multi-paso
const initialState = {
    // Info de CreateEvent.jsx
    nombre: "",
    descripcion: "",
    informAdic: "",
    restricciones: "",
    idCategoria: null,
    imagenFile: null, // Para el archivo de imagen
    funciones: [{ fechaInicio: "", horaInicio: "", fechaFin: "", horaFin: "" }],

    // Info de UbicacionEvento.jsx
    idCiudad: null,
    direccion: "",
    mapaFile: null, // Para el archivo del mapa

    // Info de CreateTicket.jsx (que veremos después)
    temporadas: [],
    tiposDeEntrada: [],
    zonas: []
};

// 2. Creamos el contexto
const EventCreationContext = createContext();

// 3. Creamos el "Proveedor" del contexto, que manejará el estado
export const EventCreationProvider = ({ children }) => {
    const [eventData, setEventData] = useState(initialState);

    // Función para actualizar cualquier parte del estado
    const updateEventData = (newData) => {
        setEventData(prevData => ({ ...prevData, ...newData }));
    };

    // Función para resetear el estado si el usuario cancela
    const resetEventData = () => {
        setEventData(initialState);
    };

    return (
        <EventCreationContext.Provider value={{ eventData, updateEventData, resetEventData }}>
            {children}
        </EventCreationContext.Provider>
    );
};

// 4. Creamos un "Hook" personalizado para usar el contexto fácilmente
export const useEventCreation = () => useContext(EventCreationContext);