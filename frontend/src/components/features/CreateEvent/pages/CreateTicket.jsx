import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEventCreation } from "../../../../context/EventCreationContext";
import "./CreateTicket.css";
import {postEventoCompleto} from '../../../../globalServices/EventoService';

export const CreateTicket = () => {
    const navigate = useNavigate();
    const { eventData, updateEventData } = useEventCreation();

    // Estados locales para los carruseles
    const [temporadaActual, setTemporadaActual] = useState(0);
    const [entradaActual, setEntradaActual] = useState(0);

    // Inicializa los datos en el contexto si están vacíos
    useEffect(() => {
        if (eventData.temporadas.length === 0 && eventData.tiposDeEntrada.length === 0) {
            updateEventData({
                temporadas: [{ nombre: "Temporada 1", porcentajeDesc: 0, fechaInicio: "", fechaFin: "" }],
                tiposDeEntrada: [{ nombre: "", moneda: "PEN", precioBase: 0, cantidadMax: 10, descripcion: "" }],
                zonas: [{ nombre: "", numAsientos: 0, nombreTipoEntrada: "" }]
            });
        }
    }, []);

    // --- MANEJADORES DE ESTADO ---
    const handleItemChange = (arrayName, index, field, value) => {
        const newArray = [...eventData[arrayName]];
        const isNumericField = ['porcentajeDesc', 'precioBase', 'cantidadMax', 'numAsientos'].includes(field);
        const finalValue = isNumericField ? Number(value) : value;
        newArray[index] = { ...newArray[index], [field]: finalValue };
        updateEventData({ [arrayName]: newArray });
    };

    // --- LÓGICA DE TEMPORADAS ---
    const addTemporada = () => {
        const nuevasTemporadas = [...eventData.temporadas, { nombre: `Temporada ${eventData.temporadas.length + 1}`, porcentajeDesc: 0, fechaInicio: "", fechaFin: "" }];
        updateEventData({ temporadas: nuevasTemporadas });
        setTemporadaActual(nuevasTemporadas.length - 1);
    };

    const removeCurrentTemporada = () => {
        if (eventData.temporadas.length <= 1) return;
        const nuevasTemporadas = eventData.temporadas.filter((_, i) => i !== temporadaActual);
        updateEventData({ temporadas: nuevasTemporadas });
        if (temporadaActual >= nuevasTemporadas.length) {
            setTemporadaActual(nuevasTemporadas.length - 1);
        }
    };
    
    // --- LÓGICA DE ENTRADAS ---
    const addEntrada = () => {
        const nuevosTipos = [...eventData.tiposDeEntrada, { nombre: "", moneda: "PEN", precioBase: 0, cantidadMax: 10, descripcion: "" }];
        const nuevasZonas = [...eventData.zonas, { nombre: "", numAsientos: 0, nombreTipoEntrada: "" }];
        updateEventData({ tiposDeEntrada: nuevosTipos, zonas: nuevasZonas });
        setEntradaActual(nuevosTipos.length - 1);
    };

    const removeCurrentEntrada = () => {
        if (eventData.tiposDeEntrada.length <= 1) return;
        const nuevosTipos = eventData.tiposDeEntrada.filter((_, i) => i !== entradaActual);
        const nuevasZonas = eventData.zonas.filter((_, i) => i !== entradaActual);
        updateEventData({ tiposDeEntrada: nuevosTipos, zonas: nuevasZonas });
        if (entradaActual >= nuevosTipos.length) {
            setEntradaActual(nuevosTipos.length - 1);
        }
    };
    
    const handleTipoNombreChange = (e) => {
        const newName = e.target.value;
        handleItemChange('tiposDeEntrada', entradaActual, 'nombre', newName);
        handleItemChange('zonas', entradaActual, 'nombreTipoEntrada', newName);
    };

    // --- NAVEGACIÓN DE CARRUSELES ---
    const irTemporadaIzq = () => setTemporadaActual(p => (p === 0 ? eventData.temporadas.length - 1 : p - 1));
    const irTemporadaDer = () => setTemporadaActual(p => (p === eventData.temporadas.length - 1 ? 0 : p + 1));
    const irEntradaIzq = () => setEntradaActual(p => (p === 0 ? eventData.tiposDeEntrada.length - 1 : p - 1));
    const irEntradaDer = () => setEntradaActual(p => (p === eventData.tiposDeEntrada.length - 1 ? 0 : p + 1));
    
    // --- FUNCIÓN DE ENVÍO FINAL ---
    const handleFinalSubmit = async () => { 
        console.log("Enviando datos finales al backend:", eventData);

        // Validaciones básicas antes de enviar
        if (!eventData.nombre || !eventData.idCategoria || !eventData.idCiudad) {
            alert("Por favor, asegúrate de que el nombre del evento, la categoría y la ciudad estén seleccionados.");
            return;
        }

        // Aquí se debería integrar la lógica para subir los archivos (imagen y mapa) a un
        // servicio como AWS S3 y obtener las URLs. Por ahora, se omiten para que el JSON sea válido.
        const payload = {
            // Datos del Evento (vienen del contexto)
            nombre: eventData.nombre,
            descripcion: eventData.descripcion,
            informAdic: eventData.informAdic,
            restricciones: eventData.restricciones,
            direccion: eventData.direccion,
            idCiudad: eventData.idCiudad,
            idCategoria: eventData.idCategoria,
            //ESTAS IMAGENES TENDRÁN QUE MODIFICARSE PARA ACEPTAR LO DEL S3 (falta implementar)
            urlImagen: eventData.imagenFile ? "placeholder-image.jpg" : "https://via.placeholder.com/836x522.png?text=Imagen+Evento",
            urlMapa: eventData.mapaFile ? "placeholder-map.jpg" : "https://via.placeholder.com/836x522.png?text=Mapa+Referencia",

            // Listas de entidades relacionadas
            funciones: eventData.funciones.map(f => ({
                ...f,
                // Asegura que el formato de hora sea HH:mm:ss como espera el backend
                horaInicio: f.horaInicio ? `${f.horaInicio}:00` : "00:00:00",
                horaFin: f.horaFin ? `${f.horaFin}:00` : "00:00:00",
            })),
            temporadas: eventData.temporadas,
            tiposDeEntrada: eventData.tiposDeEntrada,
            zonas: eventData.zonas,
        };

       try {
            // Llama directamente a tu función de servicio.
            // apiFetch (dentro de postEventoCompleto) se encargará de añadir el token.
            const eventoCreado = await postEventoCompleto(payload);
            
            alert('¡Evento creado con éxito!');
            console.log('Respuesta del servidor:', eventoCreado);
            navigate('/home');

        } catch (error) {
            console.error("Error al crear el evento:", error);
            // El error de apiFetch ya viene formateado (ej: "401 Unauthorized")
            alert(`Hubo un problema al crear el evento: ${error.message}`);
        }
    };

    // Guarda de renderizado para evitar errores
    if (!eventData.temporadas.length || !eventData.tiposDeEntrada.length || !eventData.zonas.length) {
        return <div>Inicializando...</div>;
    }

    const currentTemporada = eventData.temporadas[temporadaActual];
    const currentTipoEntrada = eventData.tiposDeEntrada[entradaActual];
    const currentZona = eventData.zonas[entradaActual];

    if (!currentTemporada || !currentTipoEntrada || !currentZona) {
        return <div>Cargando datos...</div>;
    }

    return (
        <div className="crear-ticket-container">
            <div className="header">
                <span className="step">3</span>
                <h2>Crear Entradas</h2>
            </div>
            <div className="campo">
                <label htmlFor="moneda">Moneda</label>
                <select id="moneda" value={currentTipoEntrada.moneda} onChange={e => handleItemChange('tiposDeEntrada', entradaActual, 'moneda', e.target.value)}>
                    <option value="PEN">S (PEN)</option>
                    <option value="USD">$ (USD)</option>
                </select>
            </div>
            
            <div className="funciones-section">
                <div className="funciones-header">
                    <button className="btn p-0 me-2 text-success fw-semibold" onClick={addTemporada}>+ Agregar temporada</button>
                    {/* ✅ CORRECCIÓN AQUÍ */}
                    <button className="btn p-0 me-2 text-danger fw-semibold" onClick={removeCurrentTemporada}>Eliminar</button>
                    <button className="season-tab__arrow" onClick={irTemporadaIzq}>&#60;</button>
                    <span className="fw-bold text-success">Temporada {temporadaActual + 1} de {eventData.temporadas.length}</span>
                    <button className="season-tab__arrow" onClick={irTemporadaDer}>&#62;</button>
                </div>
                <div className="row g-3 rounded-3 p-3" style={{ background: "#eaf7ef" }}>
                    <div className="col-12 col-md-4">
                        <label>Nombre de la temporada</label>
                        <input type="text" className="form-control" placeholder="Escribe la temporada" value={currentTemporada.nombre} onChange={e => handleItemChange('temporadas', temporadaActual, 'nombre', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-2">
                        <label>Descuento</label>
                        <input type="number" className="form-control" value={currentTemporada.porcentajeDesc} onChange={e => handleItemChange('temporadas', temporadaActual, 'porcentajeDesc', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-3">
                        <label>Fecha de Inicio</label>
                        <input type="date" className="form-control" value={currentTemporada.fechaInicio || ""} onChange={e => handleItemChange('temporadas', temporadaActual, 'fechaInicio', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-3">
                        <label>Fecha de Fin</label>
                        <input type="date" className="form-control" value={currentTemporada.fechaFin || ""} onChange={e => handleItemChange('temporadas', temporadaActual, 'fechaFin', e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="funciones-section">
                <div className="funciones-header">
                    <button className="btn p-0 me-2 text-success fw-semibold" onClick={addEntrada}>+ Agregar entrada</button>
                     {/* ✅ CORRECCIÓN AQUÍ */}
                    <button className="btn p-0 me-2 text-danger fw-semibold" onClick={removeCurrentEntrada}>Eliminar</button>
                    <button className="season-tab__arrow" onClick={irEntradaIzq}>&#60;</button>
                    <span className="fw-bold text-success">Entrada {entradaActual + 1} de {eventData.tiposDeEntrada.length}</span>
                    <button className="season-tab__arrow" onClick={irEntradaDer}>&#62;</button>
                </div>
                <div className="row g-3 rounded-3 p-3" style={{ background: "#eaf7ef" }}>
                    <div className="col-12 col-md-4">
                        <label>Tipo de la entrada</label>
                        <input type="text" className="form-control" placeholder="VIP, Preferencial, Estándar" value={currentTipoEntrada.nombre} onChange={handleTipoNombreChange} />
                    </div>
                    <div className="col-12 col-md-4">
                        <label>Zona de la entrada</label>
                        <input type="text" className="form-control" placeholder="Zona del estadio" value={currentZona.nombre} onChange={e => handleItemChange('zonas', entradaActual, 'nombre', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-3">
                        <label>Precio Base</label>
                        <input type="number" className="form-control" value={currentTipoEntrada.precioBase} onChange={e => handleItemChange('tiposDeEntrada', entradaActual, 'precioBase', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-4">
                        <label>Max. cantidad por orden</label>
                        <input type="number" className="form-control" value={currentTipoEntrada.cantidadMax} onChange={e => handleItemChange('tiposDeEntrada', entradaActual, 'cantidadMax', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-4">
                        <label>N° de Asientos / Cantidad Disponible</label>
                        <input type="number" className="form-control" value={currentZona.numAsientos} onChange={e => handleItemChange('zonas', entradaActual, 'numAsientos', e.target.value)} />
                    </div>
                    <div className="col-12 col-md-4">
                        <label className="form-label">Descripción</label>
                        <textarea className="form-control" rows="4" placeholder="Escribe información adicional..." value={currentTipoEntrada.descripcion} onChange={e => handleItemChange('tiposDeEntrada', entradaActual, 'descripcion', e.target.value)} />
                    </div>
                    
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" id="permiteButaca" disabled />
                        <label className="form-check-label" htmlFor="permiteButaca">Permite seleccionar butaca</label>
                    </div>
                    <input type="file" className="form-control" disabled />
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="cancel" onClick={() => navigate("/ubicacion-evento")}>Regresar</button>
                <button type="button" className="finish" onClick={handleFinalSubmit}>Finalizar y Guardar Evento</button>
            </div>
        </div>
    );
};