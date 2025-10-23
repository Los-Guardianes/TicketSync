import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";
import { getCateventos } from '../../../services/EventoService';
import { useEventCreation } from "../../../context/EventCreationContext"; // 1. Importas el hook

export const CreateEvent = () => {
    const navigate = useNavigate();
    // 2. Usas el contexto como única fuente de verdad para los datos del formulario
    const { eventData, updateEventData } = useEventCreation();

    // 3. Mantienes estados locales SOLO para la UI de este componente
    const [catEvento, setCatEvento] = useState([]); // Para poblar el <select>
    const [funcionActual, setFuncionActual] = useState(0); // Para el carrusel de funciones
    const [dragActive, setDragActive] = useState(false); // Para el drag-and-drop
    
    // Referencias para elementos del DOM
    const dragCounter = useRef(0);
    const inputFileRef = useRef(null);

    // Cargar categorías desde la API al montar el componente
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const data = await getCateventos();
                setCatEvento(data);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
            }
        };
        fetchCategorias();
    }, []);

    // --- MANEJADORES DE ESTADO (Ahora actualizan el contexto) ---

    // Función genérica para manejar cambios en la mayoría de inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si el campo es 'idCategoria', conviértelo a número, si no, déjalo como está.
        const finalValue = name === 'idCategoria' ? Number(value) : value;
        updateEventData({ [name]: finalValue });
    };

    // Función específica para manejar cambios en el array de funciones
    const handleFuncionChange = (e, index) => {
        const { name, value } = e.target;
        // Creamos una copia del array de funciones del contexto
        const nuevasFunciones = [...eventData.funciones];
        // Modificamos el objeto específico
        nuevasFunciones[index] = { ...nuevasFunciones[index], [name]: value };
        // Actualizamos el contexto con el nuevo array
        updateEventData({ funciones: nuevasFunciones });
    };
    
    // Función para manejar la selección de la imagen
    const handleImagenChange = (file) => {
        updateEventData({ imagenFile: file });
    };
    
    // --- LÓGICA DE LA UI (Funciones, Carrusel, Drag & Drop) ---
    
    const agregarFuncion = () => {
        const nuevasFunciones = [...eventData.funciones, { fechaInicio: "", horaInicio: "", fechaFin: "", horaFin: "" }];
        updateEventData({ funciones: nuevasFunciones });
        setFuncionActual(nuevasFunciones.length - 1); // Navega a la nueva función
    };

    const eliminarFuncion = () => {
        if (eventData.funciones.length === 1) return; // No eliminar si solo hay una
        const nuevasFunciones = eventData.funciones.filter((_, i) => i !== funcionActual);
        updateEventData({ funciones: nuevasFunciones });
        // Ajusta el índice actual para no quedar fuera de rango
        setFuncionActual(prev => Math.min(prev, nuevasFunciones.length - 1));
    };

    const irFuncionIzquierda = () => {
        setFuncionActual(prev => (prev === 0 ? eventData.funciones.length - 1 : prev - 1));
    };

    const irFuncionDerecha = () => {
        setFuncionActual(prev => (prev === eventData.funciones.length - 1 ? 0 : prev + 1));
    };

    // Lógica de Drag and Drop (sin cambios)
    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter.current++; setDragActive(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter.current--; if (dragCounter.current === 0) { setDragActive(false); } };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImagenChange(e.dataTransfer.files[0]);
        }
    };

    const handleNext = () => {
        // Aquí puedes añadir validaciones si lo necesitas
        console.log("Datos guardados en el paso 1:", eventData);
        navigate("/ubicacion-evento");
    };

    return (
        <>
            <div className="crear-evento-container">
                <div className="header">
                    <span className="step">1</span>
                    <h2>Detalles del evento</h2>
                </div>

                <form className="evento-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-content">
                        {/* Columna izquierda */}
                        <div className="form-left">
                            <div className="campo">
                                <label htmlFor="nombre">Nombre de evento</label>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    value={eventData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ingrese el nombre del evento"
                                />
                            </div>

                            <div className="campo">
                                <label htmlFor="idCategoria">Categoría</label>
                                <select
                                    id="idCategoria"
                                    name="idCategoria"
                                    value={eventData.idCategoria || ""}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Elige una categoría</option>
                                    {catEvento.map((categoria) => (
                                        <option key={categoria.idCategoria} value={categoria.idCategoria}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="funciones-section">
                                <div className="funciones-header">
                                    <span className="agregar-funcion" onClick={agregarFuncion}>+ Agregar función</span>
                                    <span className="eliminar-funcion" onClick={eliminarFuncion}>Eliminar función</span>
                                </div>
                                <div className="funcion-navegacion">
                                    <button type="button" className="flecha" onClick={irFuncionIzquierda}>&#60;</button>
                                    <span className="funcion-label">Función {funcionActual + 1} de {eventData.funciones.length}</span>
                                    <button type="button" className="flecha" onClick={irFuncionDerecha}>&#62;</button>
                                </div>
                                <div className="funcion">
                                    <div className="fechas">
                                        <div className="fecha-hora">
                                            <label>Fecha y hora de inicio</label>
                                            <input
                                                type="date"
                                                name="fechaInicio"
                                                value={eventData.funciones[funcionActual]?.fechaInicio || ""}
                                                onChange={(e) => handleFuncionChange(e, funcionActual)}
                                            />
                                            <input
                                                type="time"
                                                name="horaInicio"
                                                value={eventData.funciones[funcionActual]?.horaInicio || ""}
                                                onChange={(e) => handleFuncionChange(e, funcionActual)}
                                            />
                                        </div>
                                        <div className="fecha-hora">
                                            <label>Fecha y hora de fin</label>
                                            <input
                                                type="date"
                                                name="fechaFin"
                                                value={eventData.funciones[funcionActual]?.fechaFin || ""}
                                                onChange={(e) => handleFuncionChange(e, funcionActual)}
                                            />
                                            <input
                                                type="time"
                                                name="horaFin"
                                                value={eventData.funciones[funcionActual]?.horaFin || ""}
                                                onChange={(e) => handleFuncionChange(e, funcionActual)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="campo">
                                <label htmlFor="restricciones">Restricciones</label>
                                <input
                                    id="restricciones"
                                    name="restricciones"
                                    type="text"
                                    value={eventData.restricciones}
                                    onChange={handleChange}
                                    placeholder="Agrega una restricción" />
                            </div>

                            <div className="campo">
                                <label htmlFor="descripcion">Descripción</label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={eventData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Escriba un párrafo corto pero potente que describa tu evento" />
                            </div>
                        </div>

                        {/* Columna derecha */}
                        <div className="form-right">
                            <div className="campo">
                                <label htmlFor="imagen">Imagen (836px x 522px)</label>
                                <div
                                    className={`imagen-placeholder${dragActive ? ' drag-active' : ''}`}
                                    onClick={() => inputFileRef.current?.click()}
                                    onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver} onDrop={handleDrop}
                                    style={{ cursor: 'pointer', position: 'relative' }}
                                >
                                    {eventData.imagenFile ? (
                                        <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img
                                                src={URL.createObjectURL(eventData.imagenFile)}
                                                alt="Vista previa"
                                                style={{ maxWidth: '300px', maxHeight: '160px', objectFit: 'contain', borderRadius: '8px', margin: '0 auto' }}
                                            />
                                            <button
                                                type="button" onClick={(e) => { e.stopPropagation(); handleImagenChange(null); }}
                                                style={{ position: 'absolute', top: 8, right: 8, background: '#fff', color: '#d32f2f', border: '1px solid #d32f2f', borderRadius: '50%', width: '32px', height: '32px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', zIndex: 3 }}
                                                title="Eliminar imagen"
                                            >×</button>
                                        </div>
                                    ) : (
                                        !dragActive && <span style={{ color: '#219653', fontWeight: 500, fontSize: '1.2rem' }}>Presione o arrastre aquí para subir una imagen</span>
                                    )}
                                    <input
                                        type="file" accept="image/*" ref={inputFileRef} style={{ display: 'none' }}
                                        onChange={(e) => e.target.files && e.target.files[0] && handleImagenChange(e.target.files[0])}
                                    />
                                    {dragActive && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(33,150,83,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#219653', fontWeight: 600, fontSize: '1.1rem', zIndex: 2 }}>Suelta la imagen aquí</div>}
                                </div>
                            </div>
                            <div className="campo">
                                <label htmlFor="informAdic">Información adicional</label>
                                <textarea
                                    id="informAdic"
                                    name="informAdic"
                                    value={eventData.informAdic}
                                    onChange={handleChange}
                                    placeholder="Brinde a los usuarios mas información: Detalles del evento, duración aproximada, panelistas, links relacionados, cronograma de eventos, etc." />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel" onClick={() => navigate("/home")}>Cancelar</button>
                        <button type="button" className="next" onClick={handleNext}>Siguiente</button>
                    </div>
                </form>
            </div>
        </>
    );
};