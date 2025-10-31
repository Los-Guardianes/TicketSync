import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEventCreation } from "../../../../context/EventCreationContext";
import "./CreateTicket.css";
import { postEventoCompleto } from '../../../../globalServices/EventoService';
import { X, Plus, Trash2 } from 'lucide-react';

// Modal Component
const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const CreateTicket = () => {
    // Simulando el contexto
    const [event, setEvent] = useState({
        moneda: "PEN",
        temporadas: [{
            nombre: "Temporada 1",
            tipoDescuento: "porcentaje",
            descuento: 0,
            fechaInicio: "",
            fechaFin: ""
        }],
        tiposDeEntrada: [{
            nombre: "",
            precioBase: 0,
            cantidadMax: 10,
            descripcion: "",
            zonasAsignadas: []
        }],
        zonas: []
    });

    const updateEvent = (updates) => {
        setEvent(prev => ({ ...prev, ...updates }));
    };
    const navigate = useNavigate();
    const { eventData, updateEventData } = useEventCreation();

    // Estados locales para los carruseles
    const [temporadaActual, setTemporadaActual] = useState(0);
    const [entradaActual, setEntradaActual] = useState(0);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [nuevaZona, setNuevaZona] = useState({ nombre: "", numAsientos: 0 });

    // ZONAS
    const abrirModalZona = () => {
        setNuevaZona({ nombre: "", numAsientos: 0 });
        setModalAbierto(true);
    };

    const handleAgregarZona = () => {
        // Comprobar que este todo completado
        if (!nuevaZona.nombre || nuevaZona.numAsientos <= 0) {
            alert("Por favor completa todos los campos de la zona");
            return;
        }
        // Se 
        const nuevasZonas = [...event.zonas, {
            id: Date.now(),
            ...nuevaZona
        }];
        updateEvent({ zonas: nuevasZonas });
        setModalAbierto(false);
        setNuevaZona({ nombre: "", numAsientos: 0 });
    };

    const eliminarZona = (index) => {
        const nuevasZonas = event.zonas.filter((_, i) => i !== index);
        const nuevosTipos = event.tiposDeEntrada.map(tipo => ({
            ...tipo,
            zonasAsignadas: tipo.zonasAsignadas.filter(zIndex => zIndex !== index)
                .map(zIndex => zIndex > index ? zIndex - 1 : zIndex)
        }));
        updateEvent({ zonas: nuevasZonas, tiposDeEntrada: nuevosTipos });
    };

    // Inicializa los datos en el contexto si están vacíos
    useEffect(() => {
        if (eventData.temporadas.length === 0 && eventData.tiposDeEntrada.length === 0) {
            updateEventData({
                moneda: "PEN",
                temporadas: [{ nombre: "Temporada 1", porcentajeDesc: 0, fechaInicio: "", fechaFin: "" }],
                tiposDeEntrada: [{ nombre: "", precioBase: 0, cantidadMax: 10, descripcion: "" }],
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
    const handleMonedaChange = (e) => {
        const value = e.target.value;
        updateEventData({ moneda: value });              // <- esta es la clave
        setEvent(prev => ({ ...prev, moneda: value }));  // opcional, si necesitas el local también
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
        const nuevosTipos = [...eventData.tiposDeEntrada, { nombre: "", precioBase: 0, cantidadMax: 10, descripcion: "" }];
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
    const currentMoneda = eventData.moneda;


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
                <select
                    id="moneda"
                    value={currentMoneda}
                    onChange={handleMonedaChange}
                >
                    <option value="PEN">S (PEN)</option>
                    <option value="USD">$ (USD)</option>
                </select>
            </div>


            {/* PERIODO */}
            <div className="funciones-section">
                <div className="funciones-header">
                    <button className="btn p-0 me-2 text-success fw-semibold" onClick={addTemporada}>
                        + Agregar temporada
                    </button>
                    {/* ✅ CORRECCIÓN AQUÍ */}
                    <button className="btn p-0 me-2 text-danger fw-semibold" onClick={removeCurrentTemporada}>
                        Eliminar
                    </button>
                    <button className="season-tab__arrow" onClick={irTemporadaIzq}>&#60;</button>
                    <span className="fw-bold text-success">
                        Temporada {temporadaActual + 1} de {eventData.temporadas.length}
                    </span>
                    <button className="season-tab__arrow" onClick={irTemporadaDer}>&#62;</button>
                </div>

                <div className="row g-3 rounded-3 p-3" style={{ background: "#eaf7ef" }}>
                    <div className="col-12 col-md-3">
                        <label>Nombre de la temporada</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Escribe la temporada"
                            value={currentTemporada.nombre}
                            onChange={e => handleItemChange('temporadas', temporadaActual, 'nombre', e.target.value)}
                        />
                    </div>
                    <div className="col-12 col-md-2">
                        <label>Tipo de Descuento</label>
                        <select
                            className="form-control"
                            value={currentTemporada.tipoDescuento || "porcentaje"}
                            onChange={e => handleItemChange('temporadas', temporadaActual, 'tipoDescuento', e.target.value)}
                        >
                            <option value="porcentaje">Porcentaje (%)</option>
                            <option value="monto">Monto Fijo</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-2">
                        <label>Descuento</label>
                        <input
                            type="number"
                            className="form-control"
                            value={currentTemporada.porcentajeDesc || 0}
                            onChange={e => handleItemChange('temporadas', temporadaActual, 'porcentajeDesc', e.target.value)}
                            placeholder={currentTemporada.tipoDescuento === "porcentaje" ? "%" : currentMoneda}
                        />
                    </div>
                    <div className="col-12 col-md-2">
                        <label>Fecha de Inicio</label>
                        <input
                            type="date"
                            className="form-control"
                            value={currentTemporada.fechaInicio || ""}
                            onChange={e => handleItemChange('temporadas', temporadaActual, 'fechaInicio', e.target.value)}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <label>Fecha de Fin</label>
                        <input
                            type="date"
                            className="form-control"
                            value={currentTemporada.fechaFin || ""}
                            onChange={e => handleItemChange('temporadas', temporadaActual, 'fechaFin', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* ZONAS */}
            <div className="zonas-section">
                <div className="zonas-header">
                    <h3 className="text-success">Zonas del Evento</h3>
                    <button className="btn-add-zona" onClick={abrirModalZona}>
                        <Plus size={16} /> Agregar Zona
                    </button>
                </div>
                <div className="zonas-grid">
                    {event.zonas && event.zonas.length > 0 ? (
                        event.zonas.map((zona, index) => (
                            <div key={zona.id || index} className="zona-card">
                                <div className="zona-card-header">
                                    <span className="zona-number">Zona {index + 1}</span>
                                    <button
                                        className="btn-icon-delete"
                                        onClick={() => eliminarZona(index)}
                                        title="Eliminar zona"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="zona-card-body">
                                    <div className="zona-info">
                                        <span className="zona-label">Nombre:</span>
                                        <span className="zona-value">{zona.nombre}</span>
                                    </div>
                                    <div className="zona-info">
                                        <span className="zona-label">Asientos:</span>
                                        <span className="zona-value">{zona.numAsientos}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>No hay zonas creadas. Haz clic en "Agregar Zona" para comenzar.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="funciones-section">
                <div className="funciones-header">
                    <button className="btn p-0 me-2 text-success fw-semibold" onClick={addEntrada}>
                        + Agregar entrada
                    </button>
                    {/* ✅ CORRECCIÓN AQUÍ */}
                    <button className="btn p-0 me-2 text-danger fw-semibold" onClick={removeCurrentEntrada}>
                        Eliminar
                    </button>
                    <button className="season-tab__arrow" onClick={irEntradaIzq}>&#60;</button>
                    <span className="fw-bold text-success">
                        Entrada {entradaActual + 1} de {eventData.tiposDeEntrada.length}
                    </span>
                    <button className="season-tab__arrow" onClick={irEntradaDer}>&#62;</button>
                </div>
                <div className="row g-3 rounded-3 p-3" style={{ background: "#eaf7ef" }}>
                    <div className="col-12 col-md-4">
                        <label>Nombre del Tipo de Entrada</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="VIP, Preferencial, Estándar"
                            value={currentTipoEntrada.nombre}
                            onChange={handleTipoNombreChange}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <label>Precio Base</label>
                        <input
                            type="number"
                            className="form-control"
                            value={currentTipoEntrada.precioBase}
                            onChange={e => handleItemChange('tiposDeEntrada', entradaActual, 'precioBase', e.target.value)}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <label>Max. cantidad por orden</label>
                        <input
                            type="number"
                            className="form-control"
                            value={currentTipoEntrada.cantidadMax}
                            onChange={e => handleItemChange('tiposDeEntrada', entradaActual, 'cantidadMax', e.target.value)}
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Escribe información adicional..."
                            value={currentTipoEntrada.descripcion}
                            onChange={e => handleItemChange('tiposDeEntrada', entradaActual, 'descripcion', e.target.value)}
                        />
                    </div>

                    <div className="col-12">
                        <label className="fw-semibold mb-2">Zonas asignadas a este tipo de entrada:</label>
                        {event.zonas && event.zonas.length > 0 ? (
                            <div className="zonas-checkbox-grid">
                                {event.zonas.map((zona, index) => (
                                    <div key={index} className="form-check zona-checkbox">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`zona-${entradaActual}-${index}`}
                                            checked={(currentTipoEntrada.zonasAsignadas || []).includes(index)}
                                            onChange={() => handleZonaAsignada(index)}
                                        />
                                        <label className="form-check-label" htmlFor={`zona-${entradaActual}-${index}`}>
                                            {zona.nombre || `Zona ${index + 1}`} ({zona.numAsientos} asientos)
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">No hay zonas disponibles. Crea zonas primero.</p>
                        )}
                    </div>

                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="cancel" onClick={() => navigate("/ubicacion-evento")}>Regresar</button>
                <button type="button" className="finish" onClick={handleFinalSubmit}>Finalizar y Guardar Evento</button>
            </div>

            {/* MODAL PARA AGREGAR ZONA */}
            <Modal
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                title="Agregar Nueva Zona"
            >
                <div className="modal-form">
                    <div className="modal-field">
                        <label>Nombre de la Zona</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: VIP, Platea, General"
                            value={nuevaZona.nombre}
                            onChange={e => setNuevaZona({ ...nuevaZona, nombre: e.target.value })}
                        />
                    </div>
                    <div className="modal-field">
                        <label>Cantidad de Asientos</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="0"
                            value={nuevaZona.numAsientos}
                            onChange={e => setNuevaZona({ ...nuevaZona, numAsientos: Number(e.target.value) })}
                        />
                    </div>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => setModalAbierto(false)}>
                            Cancelar
                        </button>
                        <button className="btn-confirm" onClick={handleAgregarZona}>
                            Agregar Zona
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};