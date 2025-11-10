import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from 'lucide-react';
import "./CreateTicket.css";

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

export const CreateTicket2 = () => {
    // Simulando el contexto
    const [eventData, setEventData] = useState({
        temporadas: [{ 
            nombre: "Temporada 1", 
            tipoDescuento: "porcentaje", 
            descuento: 0, 
            fechaInicio: "", 
            fechaFin: "" 
        }],
        tiposDeEntrada: [{ 
            nombre: "", 
            moneda: "PEN", 
            precioBase: 0, 
            cantidadMax: 10, 
            descripcion: "", 
            zonasAsignadas: [] 
        }],
        zonas: []
    });

    const [temporadaActual, setTemporadaActual] = useState(0);
    const [entradaActual, setEntradaActual] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newZona, setNewZona] = useState({ nombre: "", numAsientos: 0 });

    const updateEventData = (updates) => {
        setEventData(prev => ({ ...prev, ...updates }));
    };

    const handleItemChange = (arrayName, index, field, value) => {
        const newArray = [...eventData[arrayName]];
        const isNumericField = ['descuento', 'precioBase', 'cantidadMax', 'numAsientos'].includes(field);
        const finalValue = isNumericField ? Number(value) : value;
        newArray[index] = { ...newArray[index], [field]: finalValue };
        updateEventData({ [arrayName]: newArray });
    };

    // TEMPORADAS
    const addTemporada = () => {
        const nuevasTemporadas = [...eventData.temporadas, { 
            nombre: `Temporada ${eventData.temporadas.length + 1}`, 
            tipoDescuento: "porcentaje",
            descuento: 0, 
            fechaInicio: "", 
            fechaFin: "" 
        }];
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

    // ZONAS
    const openModalZona = () => {
        setNewZona({ nombre: "", numAsientos: 0 });
        setIsModalOpen(true);
    };

    const handleAddZona = () => {
        if (!newZona.nombre || newZona.numAsientos <= 0) {
            alert("Por favor completa todos los campos de la zona");
            return;
        }
        const nuevasZonas = [...eventData.zonas, { 
            id: Date.now(), 
            ...newZona 
        }];
        updateEventData({ zonas: nuevasZonas });
        setIsModalOpen(false);
        setNewZona({ nombre: "", numAsientos: 0 });
    };

    const removeZona = (index) => {
        const nuevasZonas = eventData.zonas.filter((_, i) => i !== index);
        const nuevosTipos = eventData.tiposDeEntrada.map(tipo => ({
            ...tipo,
            zonasAsignadas: tipo.zonasAsignadas.filter(zIndex => zIndex !== index)
                .map(zIndex => zIndex > index ? zIndex - 1 : zIndex)
        }));
        updateEventData({ zonas: nuevasZonas, tiposDeEntrada: nuevosTipos });
    };

    // TIPOS DE ENTRADA
    const addEntrada = () => {
        const nuevosTipos = [...eventData.tiposDeEntrada, { 
            nombre: "", 
            moneda: "PEN", 
            precioBase: 0, 
            cantidadMax: 10, 
            descripcion: "",
            zonasAsignadas: []
        }];
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

    const handleZonaAsignada = (zonaIndex) => {
        const currentTipo = eventData.tiposDeEntrada[entradaActual];
        const zonasAsignadas = currentTipo.zonasAsignadas || [];
        
        const isSelected = zonasAsignadas.includes(zonaIndex);
        const newZonasAsignadas = isSelected 
            ? zonasAsignadas.filter(i => i !== zonaIndex)
            : [...zonasAsignadas, zonaIndex];
        
        handleItemChange('tiposDeEntrada', entradaActual, 'zonasAsignadas', newZonasAsignadas);
    };

    // NAVEGACIÓN
    const irTemporadaIzq = () => setTemporadaActual(p => (p === 0 ? eventData.temporadas.length - 1 : p - 1));
    const irTemporadaDer = () => setTemporadaActual(p => (p === eventData.temporadas.length - 1 ? 0 : p + 1));
    const irEntradaIzq = () => setEntradaActual(p => (p === 0 ? eventData.tiposDeEntrada.length - 1 : p - 1));
    const irEntradaDer = () => setEntradaActual(p => (p === eventData.tiposDeEntrada.length - 1 ? 0 : p + 1));

    const handleFinalSubmit = () => {
        console.log("Datos finales:", eventData);
        alert("¡Evento guardado exitosamente!");
    };

    const currentTemporada = eventData.temporadas[temporadaActual];
    const currentTipoEntrada = eventData.tiposDeEntrada[entradaActual];

    return (
        <>
            <div className="crear-ticket-container">
                <div className="header">
                    <span className="step">3</span>
                    <h2>Crear Entradas</h2>
                </div>

                <div className="campo">
                    <label htmlFor="moneda">Moneda</label>
                    <select 
                        id="moneda" 
                        value={currentTipoEntrada.moneda} 
                        onChange={e => handleItemChange('tiposDeEntrada', entradaActual, 'moneda', e.target.value)}
                    >
                        <option value="PEN">S (PEN)</option>
                        <option value="USD">$ (USD)</option>
                    </select>
                </div>

                {/* TEMPORADAS */}
                <div className="funciones-section">
                    <div className="funciones-header">
                        <button className="btn p-0 me-2 text-success fw-semibold" onClick={addTemporada}>
                            + Agregar temporada
                        </button>
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
                                value={currentTemporada.descuento || 0} 
                                onChange={e => handleItemChange('temporadas', temporadaActual, 'descuento', e.target.value)} 
                                placeholder={currentTemporada.tipoDescuento === "porcentaje" ? "%" : currentTipoEntrada.moneda}
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
                        <button className="btn-add-zona" onClick={openModalZona}>
                            <Plus size={16} /> Agregar Zona
                        </button>
                    </div>
                    <div className="zonas-grid">
                        {eventData.zonas && eventData.zonas.length > 0 ? (
                            eventData.zonas.map((zona, index) => (
                                <div key={zona.id || index} className="zona-card">
                                    <div className="zona-card-header">
                                        <span className="zona-number">Zona {index + 1}</span>
                                        <button 
                                            className="btn-icon-delete" 
                                            onClick={() => removeZona(index)}
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

                {/* TIPOS DE ENTRADA */}
                <div className="funciones-section">
                    <div className="funciones-header">
                        <button className="btn p-0 me-2 text-success fw-semibold" onClick={addEntrada}>
                            + Agregar tipo de entrada
                        </button>
                        <button className="btn p-0 me-2 text-danger fw-semibold" onClick={removeCurrentEntrada}>
                            Eliminar
                        </button>
                        <button className="season-tab__arrow" onClick={irEntradaIzq}>&#60;</button>
                        <span className="fw-bold text-success">
                            Tipo {entradaActual + 1} de {eventData.tiposDeEntrada.length}
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
                                onChange={e => handleItemChange('tiposDeEntrada', entradaActual, 'nombre', e.target.value)} 
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
                            <label>Máx. cantidad por orden</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={currentTipoEntrada.cantidadMax} 
                                onChange={e => handleItemChange('tiposDeEntrada', entradaActual, 'cantidadMax', e.target.value)} 
                            />
                        </div>
                        <div className="col-12">
                            <label>Descripción</label>
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
                            {eventData.zonas && eventData.zonas.length > 0 ? (
                                <div className="zonas-checkbox-grid">
                                    {eventData.zonas.map((zona, index) => (
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
                    <button type="button" className="cancel">
                        Regresar
                    </button>
                    <button type="button" className="finish" onClick={handleFinalSubmit}>
                        Finalizar y Guardar Evento
                    </button>
                </div>
            </div>

            {/* MODAL PARA AGREGAR ZONA */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Agregar Nueva Zona"
            >
                <div className="modal-form">
                    <div className="modal-field">
                        <label>Nombre de la Zona</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Ej: VIP, Platea, General"
                            value={newZona.nombre}
                            onChange={e => setNewZona({...newZona, nombre: e.target.value})}
                        />
                    </div>
                    <div className="modal-field">
                        <label>Cantidad de Asientos</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="0"
                            value={newZona.numAsientos}
                            onChange={e => setNewZona({...newZona, numAsientos: Number(e.target.value)})}
                        />
                    </div>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </button>
                        <button className="btn-confirm" onClick={handleAddZona}>
                            Agregar Zona
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};