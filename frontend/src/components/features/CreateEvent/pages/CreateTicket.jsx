import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEventCreation } from "../../../../context/EventCreationContext";
import "./CreateTicket.css";
import { postEventoCompleto } from '../../../../globalServices/EventoService';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { validarTemporadas } from "./Validaciones/ValidacionTicket";
import { postSubirImagen } from "../../../../globalServices/S3Service"; // Importas el servicio de S3
import { HeaderEvent } from "./Componentes/HeaderEvent";


// COMPONENTE MODAL
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

// COMPONENTE CENTRAL
export const CreateTicket = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // añadido para vincular la imagen.
    const { eventData, updateEventData } = useEventCreation();

    // Estados locales para los carruseles
    const [temporadaActual, setTemporadaActual] = useState(0);
    const [entradaActual, setEntradaActual] = useState(0);

    // Modales
    const [modalZonaAbierto, setModalZonaAbierto] = useState(false);
    const [modalTipoEntradaAbierto, setModalTipoEntradaAbierto] = useState(false);
    const [modalTarifaAbierto, setModalTarifaAbierto] = useState(false);

    // Estados de validación
    const [errores, setErrores] = useState({});
    const [mostrarErrores, setMostrarErrores] = useState(false);

    // Nuevos datos
    const [nuevaZona, setNuevaZona] = useState({ nombre: "", aforo: 0 });
    const [nuevoTipoEntrada, setNuevoTipoEntrada] = useState({ nombre: "", descripcion: "" });
    const [nuevaTarifa, setNuevaTarifa] = useState({
        precioBase: 0,
        tipoEntrada: "",
        zona: ""
    });

    const currentTemporada = eventData.temporadas[temporadaActual];
    const currentMoneda = eventData.moneda || "SOL";
    const currentTipoEntrada = eventData.tiposDeEntrada[entradaActual];

    // Inicializa los datos en el contexto si están vacíos
    useEffect(() => {
        if (!eventData.temporadas || eventData.temporadas.length === 0) {
            updateEventData({
                moneda: "SOL",
                maxComprasTicket: 4,
                temporadas: [{
                    nombre: "Temporada 1",
                    tipoDesc: "MONTO",
                    valorDescuento: 0,
                    fechaInicio: "",
                    fechaFin: ""
                }],
                zonas: [],
                tiposDeEntrada: [{ nombre: "", descripcion: "" }],
                tarifas: []
            });
        }
    }, []);

    // === FUNCIONES DE VALIDACIÓN ===

    const validarZonas = () => {
        if (!eventData.zonas || eventData.zonas.length === 0) {
            return { zonas: "Debes crear al menos una zona" };
        }
        
        const erroresZonas = {};
        const nombresZonas = new Set();
        
        eventData.zonas.forEach((zona, index) => {
            if (!zona.nombre || zona.nombre.trim() === "") {
                erroresZonas[`zona-${index}-nombre`] = "El nombre de la zona es obligatorio";
            } else if (nombresZonas.has(zona.nombre.toLowerCase())) {
                erroresZonas[`zona-${index}-nombre`] = "Ya existe una zona con este nombre";
            } else {
                nombresZonas.add(zona.nombre.toLowerCase());
            }
            
            if (!zona.aforo || zona.aforo <= 0) {
                erroresZonas[`zona-${index}-aforo`] = "El aforo debe ser mayor a 0";
            }
        });
        
        return erroresZonas;
    };

    const validarTiposEntrada = () => {
        if (!eventData.tiposDeEntrada || eventData.tiposDeEntrada.length === 0) {
            return { tiposEntrada: "Debes crear al menos un tipo de entrada" };
        }
        
        const erroresEntradas = {};
        const nombresTipos = new Set();
        
        eventData.tiposDeEntrada.forEach((tipo, index) => {
            if (!tipo.nombre || tipo.nombre.trim() === "") {
                erroresEntradas[`entrada-${index}-nombre`] = "El nombre del tipo de entrada es obligatorio";
            } else if (nombresTipos.has(tipo.nombre.toLowerCase())) {
                erroresEntradas[`entrada-${index}-nombre`] = "Ya existe un tipo de entrada con este nombre";
            } else {
                nombresTipos.add(tipo.nombre.toLowerCase());
            }
        });
        
        return erroresEntradas;
    };

    const validarTarifas = () => {
        if (!eventData.tarifas || eventData.tarifas.length === 0) {
            return { tarifas: "Debes asignar al menos un precio a una zona" };
        }
        
        const erroresTarifas = {};
        
        eventData.tarifas.forEach((tarifa, index) => {
            if (!tarifa.precioBase || tarifa.precioBase <= 0) {
                erroresTarifas[`tarifa-${index}-precio`] = "El precio debe ser mayor a 0";
            }
        });
        
        return erroresTarifas;
    };

    const validarFormularioCompleto = () => {
        const erroresValidacion = {
            ...validarTemporadas(eventData.temporadas),
            ...validarZonas(),
            ...validarTiposEntrada(),
            ...validarTarifas()
        };
        
        setErrores(erroresValidacion);
        return Object.keys(erroresValidacion).length === 0;
    };

    // === MANEJADORES GENERALES ===
    const handleMonedaChange = (e) => {
        updateEventData({ moneda: e.target.value });
    };

    const handleMaxComprasChange = (e) => {
        const valor = Number(e.target.value);
        if (valor < 1) {
            setErrores({ ...errores, maxCompras: "Debe ser al menos 1" });
        } else {
            const nuevosErrores = { ...errores };
            delete nuevosErrores.maxCompras;
            setErrores(nuevosErrores);
        }
        updateEventData({ maxComprasTicket: valor });
    };

    // === LOGICA DE TEMPORADAS ===
    const agregarTemporada = () => {
        const nuevasTemporadas = [
            ...eventData.temporadas,
            {
                nombre: `Temporada ${(eventData.temporadas?.length || 0) + 1}`,
                tipoDesc: "MONTO",
                valorDescuento: 0,
                fechaInicio: "",
                fechaFin: ""
            }
        ];
        updateEventData({ temporadas: nuevasTemporadas });
        setTemporadaActual(nuevasTemporadas.length - 1);
    };

    const eliminarTemporadaActual = () => {
        if (eventData.temporadas?.length <= 1) {
            alert("Debe haber al menos una temporada");
            return;
        }
        const nuevasTemporadas = eventData.temporadas.filter((_, i) => i !== temporadaActual);
        updateEventData({ temporadas: nuevasTemporadas });
        if (temporadaActual >= nuevasTemporadas.length) {
            setTemporadaActual(nuevasTemporadas.length - 1);
        }
    };

    const handleItemChange = (arrayName, index, field, value) => {
        const newArray = [...eventData[arrayName]];
        const isNumericField = ['valorDescuento', 'aforo'].includes(field);
        const finalValue = isNumericField ? Number(value) : value;
        newArray[index] = { ...newArray[index], [field]: finalValue };
        updateEventData({ [arrayName]: newArray });
        
        // Limpiar error específico si existe
        const errorKey = `${arrayName}-${index}-${field}`;
        if (errores[errorKey]) {
            const nuevosErrores = { ...errores };
            delete nuevosErrores[errorKey];
            setErrores(nuevosErrores);
        }
    };

    // === LOGICA DE ZONAS ===
    const abrirModalZona = () => {
        setNuevaZona({ nombre: "", aforo: 0 });
        setModalZonaAbierto(true);
    };

    const handleAgregarZona = () => {
        // Validar campos vacíos
        if (!nuevaZona.nombre || nuevaZona.nombre.trim() === "") {
            alert("El nombre de la zona es obligatorio");
            return;
        }
        
        if (nuevaZona.aforo <= 0) {
            alert("El aforo debe ser mayor a 0");
            return;
        }
        
        // Validar nombres duplicados
        const nombreExiste = eventData.zonas.some(
            zona => zona.nombre.toLowerCase() === nuevaZona.nombre.toLowerCase()
        );
        
        if (nombreExiste) {
            alert("Ya existe una zona con ese nombre");
            return;
        }
        
        const nuevasZonas = [...eventData.zonas, { ...nuevaZona }];
        updateEventData({ zonas: nuevasZonas });
        setModalZonaAbierto(false);
        setNuevaZona({ nombre: "", aforo: 0 });
        
        // Limpiar errores de zonas
        const nuevosErrores = { ...errores };
        delete nuevosErrores.zonas;
        setErrores(nuevosErrores);
    };

    const eliminarZona = (index) => {
        const zonaAEliminar = eventData.zonas[index].nombre;
        const nuevasZonas = eventData.zonas.filter((_, i) => i !== index);
        const nuevasTarifas = (eventData.tarifas || []).filter(
            t => t.zona.nombre !== zonaAEliminar
        );
        updateEventData({ zonas: nuevasZonas, tarifas: nuevasTarifas });
    };

    // === TIPOS DE ENTRADA ===
    const addEntrada = () => {
        const nuevosTipos = [...eventData.tiposDeEntrada, { nombre: "", descripcion: "" }];
        updateEventData({ tiposDeEntrada: nuevosTipos });
        setEntradaActual(nuevosTipos.length - 1);
    };

    const removeCurrentEntrada = () => {
        if (eventData.tiposDeEntrada.length <= 1) {
            alert("Debe haber al menos un tipo de entrada");
            return;
        }
        const nuevosTipos = eventData.tiposDeEntrada.filter((_, i) => i !== entradaActual);
        updateEventData({ tiposDeEntrada: nuevosTipos });
        if (entradaActual >= nuevosTipos.length) {
            setEntradaActual(nuevosTipos.length - 1);
        }
    };

    const handleTipoNombreChange = (e) => {
        const newName = e.target.value;
        handleItemChange('tiposDeEntrada', entradaActual, 'nombre', newName);
        
        // Limpiar error si existe
        const errorKey = `entrada-${entradaActual}-nombre`;
        if (errores[errorKey]) {
            const nuevosErrores = { ...errores };
            delete nuevosErrores[errorKey];
            setErrores(nuevosErrores);
        }
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

    // === TARIFAS ===
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
        
        // Limpiar error de tarifas
        const nuevosErrores = { ...errores };
        delete nuevosErrores.tarifas;
        setErrores(nuevosErrores);
    };

    const handleAgregarTarifa = () => {
        if (!nuevaTarifa.tipoEntrada || !nuevaTarifa.zona || nuevaTarifa.precioBase <= 0) {
            alert("Por favor completa todos los campos de la tarifa");
            return;
        }

        // Verificar que no exista ya una tarifa con la misma combinación
        const existeTarifa = (eventData.tarifas || []).some(
            t => t.tipoEntrada.nombre === nuevaTarifa.tipoEntrada &&
                t.zona.nombre === nuevaTarifa.zona
        );

        if (existeTarifa) {
            alert("Ya existe una tarifa para esta combinación de tipo de entrada y zona");
            return;
        }

        const nuevasTarifas = [
            ...(eventData.tarifas || []),
            {
                precioBase: Number(nuevaTarifa.precioBase),
                tipoEntrada: { nombre: nuevaTarifa.tipoEntrada },
                zona: { nombre: nuevaTarifa.zona }
            }
        ];
        updateEventData({ tarifas: nuevasTarifas });
        setModalTarifaAbierto(false);
        setNuevaTarifa({ precioBase: 0, tipoEntrada: "", zona: "" });
    };

    // === NAVEGACIÓN DE CARRUSELES ===
    const irTemporadaIzq = () => setTemporadaActual(p => (p === 0 ? (eventData.temporadas?.length || 1) - 1 : p - 1));
    const irTemporadaDer = () => setTemporadaActual(p => (p === (eventData.temporadas?.length || 1) - 1 ? 0 : p + 1));
    const irEntradaIzq = () => setEntradaActual(p => (p === 0 ? eventData.tiposDeEntrada.length - 1 : p - 1));
    const irEntradaDer = () => setEntradaActual(p => (p === eventData.tiposDeEntrada.length - 1 ? 0 : p + 1));

    // === FUNCIÓN DE ENVÍO FINAL ===
    const handleFinalSubmit = async () => {
        setMostrarErrores(true);
        
        // Validar todo el formulario
        if (!validarFormularioCompleto()) {
            alert("Por favor, completa todos los campos obligatorios antes de continuar");
            // Scroll al primer error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Validaciones adicionales del eventData general
        console.log("Enviando datos finales al backend:", eventData);
        setIsLoading(true);
        let finalImageUrl = null; //La URL de S3 de la imagen que se guardará en la BD
        // Validaciones básicas
        

        if (!eventData.nombre || !eventData.idCategoria || !eventData.idCiudad) {
            alert("Por favor, completa la información básica del evento en los pasos anteriores");
            return;
        }

        if (!eventData.zonas || eventData.zonas.length === 0) {
            alert("Debes crear al menos una zona");
            return;
        }

        if (!eventData.tiposDeEntrada || eventData.tiposDeEntrada.length === 0) {
            alert("Debes crear al menos un tipo de entrada");
            return;
        }

        if (!eventData.tarifas || eventData.tarifas.length === 0) {
            alert("Debes crear al menos una tarifa");
            return;
        }
        try{
            // --- PASO 1: SUBIR IMAGEN (Lógica de SubirImagen.jsx) ---
        
            // Verificamos si el usuario seleccionó un archivo
            if (eventData.imagenFile) {
                
                // 1.1. Creas el FormData
                const formData = new FormData();
                formData.append('file', eventData.imagenFile); // Usas el archivo del contexto

                // 1.2. Llamas a tu servicio S3
                const s3Response = await postSubirImagen(formData);
                
                // 1.3. Guardas la URL devuelta por el backend
                finalImageUrl = s3Response.url;
            }
            const payload = {
                nombre: eventData.nombre,
                descripcion: eventData.descripcion,
                informAdic: eventData.informAdic,
                restricciones: eventData.restricciones,
                direccion: eventData.direccion,
                moneda: eventData.moneda || "SOL",
                maxComprasTicket: eventData.maxComprasTicket || 4,
                idCiudad: eventData.idCiudad,
                idCategoria: eventData.idCategoria,
                idUsuario: eventData.idUsuario || 21,
                urlImagen: finalImageUrl || "https://via.placeholder.com/836x522.png?text=Imagen+Evento",
                urlMapa: eventData.mapaFile ? "placeholder-map.jpg" : "https://via.placeholder.com/836x522.png?text=Mapa+Referencia",
                funciones: (eventData.funciones || []).map(f => ({
                    ...f,
                    horaInicio: f.horaInicio ? `${f.horaInicio}:00` : "00:00:00",
                    horaFin: f.horaFin ? `${f.horaFin}:00` : "00:00:00",
                })),
                temporadas: eventData.temporadas || [],
                zonas: eventData.zonas || [],
                tiposDeEntrada: eventData.tiposDeEntrada || [],
                tarifas: eventData.tarifas || []
            };

            console.log("Payload final:", JSON.stringify(payload, null, 2));

            try {
                const eventoCreado = await postEventoCompleto(payload);
                alert('¡Evento creado con éxito!');
                console.log('Respuesta del servidor:', eventoCreado);
                navigate('/home');
            } catch (error) {
                console.error("Error al crear el evento:", error);
                alert(`Hubo un problema al crear el evento: ${error.message}`);
            }
        }catch (error) {
            setIsLoading(false);
            console.error("Error en el proceso de guardado:", error);
            //Aquí se debería mostrar un mejor mensaje al usuario
            //La imagen puede quedar huérfana, mejorar esta lógica.
        }
        
    };

    // Guarda de renderizado
    if (!eventData.temporadas || eventData.temporadas.length === 0) {
        return <div>Inicializando...</div>;
    }

    return (
        <div className="crear-ticket-container">
            {/* Header */}
            <HeaderEvent currentStep={3} />
            <div className="header">
                {/* <span className="step">3</span>
                <h2>Crear Entradas</h2> */}
            </div>

            {/* MOSTRAR RESUMEN DE ERRORES */}
            {mostrarErrores && Object.keys(errores).length > 0 && (
                <div className="alert alert-danger d-flex align-items-start mb-4" role="alert">
                    <AlertCircle className="me-2 mt-1" size={20} />
                    <div>
                        <strong>Hay campos que requieren tu atención:</strong>
                        <ul className="mb-0 mt-2">
                            {Object.entries(errores).slice(0, 5).map(([key, mensaje]) => (
                                <li key={key}>{mensaje}</li>
                            ))}
                            {Object.keys(errores).length > 5 && (
                                <li>... y {Object.keys(errores).length - 5} error(es) más</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {/* CONFIGURACIÓN GENERAL */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <label htmlFor="moneda">Moneda <span className="text-danger">*</span></label>
                    <select
                        id="moneda"
                        className="form-control"
                        value={currentMoneda}
                        onChange={handleMonedaChange}
                    >
                        <option value="SOL">S/ (SOL)</option>
                        <option value="DOLAR">$ (DOLAR)</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="maxCompras">Máximo de compras por ticket <span className="text-danger">*</span></label>
                    <input
                        type="number"
                        id="maxCompras"
                        className={`form-control ${errores.maxCompras ? 'is-invalid' : ''}`}
                        value={eventData.maxComprasTicket || 4}
                        onChange={handleMaxComprasChange}
                        min="1"
                    />
                    {errores.maxCompras && (
                        <div className="invalid-feedback">{errores.maxCompras}</div>
                    )}
                </div>
            </div>

            {/* TEMPORADAS */}
            <div className="funciones-section">
                <div className="funciones-header">
                    <button className="btn p-0 me-2 text-success fw-semibold" onClick={agregarTemporada}>
                        + Agregar temporada
                    </button>
                    <button className="btn p-0 me-2 text-danger fw-semibold" onClick={eliminarTemporadaActual}>
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
                        <label>Nombre de la temporada <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className={`form-control ${errores[`temporada-${temporadaActual}-nombre`] ? 'is-invalid' : ''}`}
                            placeholder="Preventa, Venta General"
                            value={currentTemporada.nombre}
                            onChange={e => handleItemChange('temporadas', temporadaActual, 'nombre', e.target.value)}
                        />
                        {errores[`temporada-${temporadaActual}-nombre`] && (
                            <div className="invalid-feedback">{errores[`temporada-${temporadaActual}-nombre`]}</div>
                        )}
                    </div>
                    <div className="col-12 col-md-2">
                        <label>Tipo de Descuento</label>
                        <select
                            className="form-control"
                            value={currentTemporada.tipoDesc}
                            onChange={e => handleItemChange('temporadas', temporadaActual, 'tipoDesc', e.target.value)}
                        >
                            <option value="MONTO">Monto Fijo</option>
                            <option value="PORCENTAJE">Porcentaje (%)</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-2">
                        <label>Descuento</label>
                        <input
                            type="number"
                            className="form-control"
                            value={currentTemporada.valorDescuento}
                            onChange={e => handleItemChange('temporadas', temporadaActual, 'valorDescuento', e.target.value)}
                            placeholder={currentTemporada.tipoDesc === "PORCENTAJE" ? "%" : currentMoneda}
                        />
                    </div>
                    <div className="col-12 col-md-2">
                        <label>Fecha de Inicio <span className="text-danger">*</span></label>
                        <input
                            type="date"
                            className={`form-control ${errores[`temporada-${temporadaActual}-fechaInicio`] ? 'is-invalid' : ''}`}
                            value={currentTemporada.fechaInicio || ""}
                            onChange={e => handleItemChange('temporadas', temporadaActual, 'fechaInicio', e.target.value)}
                        />
                        {errores[`temporada-${temporadaActual}-fechaInicio`] && (
                            <div className="invalid-feedback">{errores[`temporada-${temporadaActual}-fechaInicio`]}</div>
                        )}
                    </div>
                    <div className="col-12 col-md-3">
                        <label>Fecha de Fin <span className="text-danger">*</span></label>
                        <input
                            type="date"
                            className={`form-control ${errores[`temporada-${temporadaActual}-fechaFin`] ? 'is-invalid' : ''}`}
                            value={currentTemporada.fechaFin || ""}
                            onChange={e => handleItemChange('temporadas', temporadaActual, 'fechaFin', e.target.value)}
                        />
                        {errores[`temporada-${temporadaActual}-fechaFin`] && (
                            <div className="invalid-feedback">{errores[`temporada-${temporadaActual}-fechaFin`]}</div>
                        )}
                    </div>
                    {errores[`temporada-${temporadaActual}-fechas`] && (
                        <div className="col-12">
                            <div className="alert alert-warning mb-0" role="alert">
                                {errores[`temporada-${temporadaActual}-fechas`]}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ZONAS */}
            <div className="zonas-section">
                <div className="zonas-header">
                    <h3 className="text-success">Zonas del Evento <span className="text-danger">*</span></h3>
                    <button className="btn-add-zona" onClick={abrirModalZona}>
                        <Plus size={16} /> Agregar Zona
                    </button>
                </div>
                {errores.zonas && (
                    <div className="alert alert-warning" role="alert">
                        <AlertCircle size={16} className="me-2" />
                        {errores.zonas}
                    </div>
                )}
                <div className="zonas-grid">
                    {eventData.zonas && eventData.zonas.length > 0 ? (
                        eventData.zonas.map((zona, index) => (
                            <div key={index} className="zona-card">
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
                                        <span className="zona-label">Aforo:</span>
                                        <span className="zona-value">{zona.aforo}</span>
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

            {/* ENTRADAS - CREAR TARIFAS POR ZONA */}
            <div className="funciones-section">
                <div className="funciones-header">
                    <button className="btn p-0 me-2 text-success fw-semibold" onClick={addEntrada}>
                        + Agregar entrada
                    </button>
                    <button className="btn p-0 me-2 text-danger fw-semibold" onClick={removeCurrentEntrada}>
                        Eliminar
                    </button>
                    <button className="season-tab__arrow" onClick={irEntradaIzq}>&#60;</button>
                    <span className="fw-bold text-success">
                        Entrada {entradaActual + 1} de {eventData.tiposDeEntrada.length}
                    </span>
                    <button className="season-tab__arrow" onClick={irEntradaDer}>&#62;</button>
                </div>

                {errores.tiposEntrada && (
                    <div className="alert alert-warning mb-3" role="alert">
                        <AlertCircle size={16} className="me-2" />
                        {errores.tiposEntrada}
                    </div>
                )}

                <div className="row g-3 rounded-3 p-3" style={{ background: "#eaf7ef" }}>
                    <div className="col-12 col-md-6">
                        <label>Nombre del Tipo de Entrada <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className={`form-control ${errores[`entrada-${entradaActual}-nombre`] ? 'is-invalid' : ''}`}
                            placeholder="VIP, Preferencial, Estándar"
                            value={currentTipoEntrada.nombre}
                            onChange={handleTipoNombreChange}
                        />
                        {errores[`entrada-${entradaActual}-nombre`] && (
                            <div className="invalid-feedback">{errores[`entrada-${entradaActual}-nombre`]}</div>
                        )}
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label">Descripción</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Escribe información adicional..."
                            value={currentTipoEntrada.descripcion}
                            onChange={e => handleItemChange('tiposDeEntrada', entradaActual, 'descripcion', e.target.value)}
                        />
                    </div>

                    <div className="col-12 mt-4">
                        <label className="fw-semibold mb-3">Asignar precios por zona: <span className="text-danger">*</span></label>

                        {errores.tarifas && (
                            <div className="alert alert-warning mb-3" role="alert">
                                <AlertCircle size={16} className="me-2" />
                                {errores.tarifas}
                            </div>
                        )}

                        {eventData.zonas && eventData.zonas.length > 0 ? (
                            <div className="row g-3">
                                {eventData.zonas.map((zona, index) => {
                                    const tarifaExistente = (eventData.tarifas || []).find(
                                        t => t.tipoEntrada.nombre === currentTipoEntrada.nombre &&
                                            t.zona.nombre === zona.nombre
                                    );

                                    return (
                                        <div key={index} className="col-12 col-md-6">
                                            <div className="p-3 border rounded" style={{ backgroundColor: '#fff' }}>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="fw-bold">{zona.nombre}</span>
                                                    <span className="text-muted small">Aforo: {zona.aforo}</span>
                                                </div>
                                                <div className="input-group">
                                                    <span className="input-group-text">{currentMoneda === 'SOL' ? 'S/' : ''}</span>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="0.00"
                                                        min="0"
                                                        step="0.01"
                                                        value={tarifaExistente?.precioBase || ''}
                                                        onChange={(e) => handleAsignarPrecioZona(zona.nombre, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="alert alert-warning">
                                <p className="mb-0">No hay zonas disponibles. Crea zonas primero en la sección anterior.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="form-actions">
                <button type="button" className="cancel" onClick={() => navigate("/ubicacion-evento")}>
                    Regresar
                </button>
                <button type="button" className="finish" onClick={handleFinalSubmit}>
                    Finalizar y Guardar Evento
                </button>
            </div>

            {/* MODAL ZONA */}
            <Modal
                isOpen={modalZonaAbierto}
                onClose={() => setModalZonaAbierto(false)}
                title="Agregar Nueva Zona"
            >
                <div className="modal-form">
                    <div className="modal-field">
                        <label>Nombre de la Zona <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="VIP, Platea, General"
                            value={nuevaZona.nombre}
                            onChange={e => setNuevaZona({ ...nuevaZona, nombre: e.target.value })}
                        />
                    </div>
                    <div className="modal-field">
                        <label>Aforo <span className="text-danger">*</span></label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="200"
                            value={nuevaZona.aforo}
                            onChange={e => setNuevaZona({ ...nuevaZona, aforo: Number(e.target.value) })}
                            min="1"
                        />
                    </div>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => setModalZonaAbierto(false)}>
                            Cancelar
                        </button>
                        <button className="btn-confirm" onClick={handleAgregarZona}>
                            Agregar Zona
                        </button>
                    </div>
                </div>
            </Modal>

            {/* MODAL TIPO ENTRADA */}
            <Modal
                isOpen={modalTipoEntradaAbierto}
                onClose={() => setModalTipoEntradaAbierto(false)}
                title="Agregar Tipo de Entrada"
            >
                <div className="modal-form">
                    <div className="modal-field">
                        <label>Nombre del Tipo <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="VIP, GENERAL, PALCO"
                            value={nuevoTipoEntrada.nombre}
                            onChange={e => setNuevoTipoEntrada({ ...nuevoTipoEntrada, nombre: e.target.value })}
                        />
                    </div>
                    <div className="modal-field">
                        <label>Descripción</label>
                        <textarea
                            className="form-control"
                            placeholder="Zona VIP cerca del escenario"
                            rows="3"
                            value={nuevoTipoEntrada.descripcion}
                            onChange={e => setNuevoTipoEntrada({ ...nuevoTipoEntrada, descripcion: e.target.value })}
                        />
                    </div>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => setModalTipoEntradaAbierto(false)}>
                            Cancelar
                        </button>
                        <button className="btn-confirm" onClick={handleAgregarTipoEntrada}>
                            Agregar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* MODAL TARIFA */}
            <Modal
                isOpen={modalTarifaAbierto}
                onClose={() => setModalTarifaAbierto(false)}
                title="Agregar Tarifa"
            >
                <div className="modal-form">
                    <div className="modal-field">
                        <label>Tipo de Entrada <span className="text-danger">*</span></label>
                        <select
                            className="form-control"
                            value={nuevaTarifa.tipoEntrada}
                            onChange={e => setNuevaTarifa({ ...nuevaTarifa, tipoEntrada: e.target.value })}
                        >
                            <option value="">Seleccionar...</option>
                            {(eventData.tiposDeEntrada || []).map((tipo, i) => (
                                <option key={i} value={tipo.nombre}>{tipo.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-field">
                        <label>Zona <span className="text-danger">*</span></label>
                        <select
                            className="form-control"
                            value={nuevaTarifa.zona}
                            onChange={e => setNuevaTarifa({ ...nuevaTarifa, zona: e.target.value })}
                        >
                            <option value="">Seleccionar...</option>
                            {(eventData.zonas || []).map((zona, i) => (
                                <option key={i} value={zona.nombre}>{zona.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-field">
                        <label>Precio Base ({currentMoneda}) <span className="text-danger">*</span></label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="350.00"
                            value={nuevaTarifa.precioBase}
                            onChange={e => setNuevaTarifa({ ...nuevaTarifa, precioBase: e.target.value })}
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => setModalTarifaAbierto(false)}>
                            Cancelar
                        </button>
                        <button className="btn-confirm" onClick={handleAgregarTarifa}>
                            Agregar Tarifa
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}