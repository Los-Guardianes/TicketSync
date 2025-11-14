import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEventCreation } from "../../../../context/EventCreationContext";
import "./CreateTicket.css";
import { postEventoCompleto } from '../../../../globalServices/EventoService';
import { X, Plus, Trash2 } from 'lucide-react';
import { postSubirImagen } from "../../../../globalServices/S3Service"; // Importas el servicio de S3


// COMPONENTE 

// COSAS POR HACER
// VALIDAR QUE NO HAYAN 2 NOMBRES IGUALES TANTO EN TIPO COMO EN ZONA
const Modal = ({ isOpen, onClose, children, title }) => {
    // SI NO ESTA ABIERTO, NO RETORNARÁ NADA
    if (!isOpen) return null;
    // SI ESTA ABIERTO
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
    const [tipoEntradaActual, setTipoEntradaActual] = useState(0);
    const [tarifaActual, setTarifaActual] = useState(0);
    const [entradaActual, setEntradaActual] = useState(0);

    // Modales
    const [modalZonaAbierto, setModalZonaAbierto] = useState(false);
    const [modalTipoEntradaAbierto, setModalTipoEntradaAbierto] = useState(false);
    const [modalTarifaAbierto, setModalTarifaAbierto] = useState(false);

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

    // === MANEJADORES GENERALES ===
    const handleMonedaChange = (e) => {
        updateEventData({ moneda: e.target.value });
    };

    const handleMaxComprasChange = (e) => {
        updateEventData({ maxComprasTicket: Number(e.target.value) });
    };

    // === LOGICA DE TEMPORADAS ===
    // AGREGAR TEMPORADA
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
    // ELIMINAR TEMPORADA ACTUAL
    const eliminarTemporadaActual = () => {
        if (eventData.temporadas?.length <= 1) return;
        const nuevasTemporadas = eventData.temporadas.filter((_, i) => i !== temporadaActual);
        updateEventData({ temporadas: nuevasTemporadas });
        if (temporadaActual >= nuevasTemporadas.length) {
            setTemporadaActual(nuevasTemporadas.length - 1);
        }
    };

    const handleItemChange = (arrayName, index, field, value) => {
        const newArray = [...eventData[arrayName]];
        const isNumericField = ['valorDescuento'].includes(field);
        const finalValue = isNumericField ? Number(value) : value;
        newArray[index] = { ...newArray[index], [field]: finalValue };
        updateEventData({ [arrayName]: newArray });
    };

    // === LOGICA DE ZONAS ===
    // MODAL DE ZONA
    const abrirModalZona = () => {
        setNuevaZona({ nombre: "", aforo: 0 });
        setModalZonaAbierto(true);
    };
    // AGREGAR NUEVA ZONA
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
    // ELIMINAR ZONA
    const eliminarZona = (index) => {
        const zonaAEliminar = eventData.zonas[index].nombre;
        const nuevasZonas = eventData.zonas.filter((_, i) => i !== index);
        // Eliminar tarifas asociadas a esta zona
        const nuevasTarifas = (eventData.tarifas || []).filter(
            t => t.zona.nombre !== zonaAEliminar
        );
        updateEventData({ zonas: nuevasZonas, tarifas: nuevasTarifas });
    };

    // === TIPOS DE ENTRADA ===
    // LOGICA
    const addEntrada = () => {

        // if (!nuevoTipoEntrada.nombre || !nuevoTipoEntrada.descripcion) {
        //     alert("Por favor completa todos los campos del tipo de entrada");
        //     return;
        // }
        const nuevosTipos = [...eventData.tiposDeEntrada, { nombre: "", descripcion: "" }];
        // updateEventData({ tiposDeEntrada: nuevosTipos });
        // setModalTipoEntradaAbierto(false);
        // setNuevoTipoEntrada({ nombre: "", descripcion: "" });


        // const nuevosTipos = [...eventData.tiposDeEntrada, { nombre: "", precioBase: 0, cantidadMax: 10, descripcion: "" }];
        // const nuevasZonas = [...eventData.zonas, { nombre: "", numAsientos: 0, nombreTipoEntrada: "" }];
        updateEventData({ tiposDeEntrada: nuevosTipos });
        setEntradaActual(nuevosTipos.length - 1);
    };

    const removeCurrentEntrada = () => {
        if (eventData.tiposDeEntrada.length <= 1) return;
        const nuevosTipos = eventData.tiposDeEntrada.filter((_, i) => i !== entradaActual);
        // const nuevasZonas = eventData.zonas.filter((_, i) => i !== entradaActual);
        updateEventData({ tiposDeEntrada: nuevosTipos });
        if (entradaActual >= nuevosTipos.length) {
            setEntradaActual(nuevosTipos.length - 1);
        }
    };


    // MODAL TIPOS DE EN
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

    const eliminarTipoEntrada = (index) => {
        const tipoAEliminar = eventData.tiposDeEntrada[index].nombre;
        const nuevosTipos = eventData.tiposDeEntrada.filter((_, i) => i !== index);
        // Eliminar tarifas asociadas a este tipo
        const nuevasTarifas = (eventData.tarifas || []).filter(
            t => t.tipoEntrada.nombre !== tipoAEliminar
        );
        updateEventData({ tiposDeEntrada: nuevosTipos, tarifas: nuevasTarifas });
        if (tipoEntradaActual >= nuevosTipos.length && nuevosTipos.length > 0) {
            setTipoEntradaActual(nuevosTipos.length - 1);
        }
    };

    const handleTipoEntradaChange = (index, field, value) => {
        const nuevosTipos = [...(eventData.tiposDeEntrada || [])];
        const nombreAnterior = nuevosTipos[index].nombre;
        nuevosTipos[index] = { ...nuevosTipos[index], [field]: value };

        // Si se cambia el nombre, actualizar las tarifas asociadas
        if (field === 'nombre') {
            const nuevasTarifas = (eventData.tarifas || []).map(t =>
                t.tipoEntrada.nombre === nombreAnterior
                    ? { ...t, tipoEntrada: { nombre: value } }
                    : t
            );
            updateEventData({ tiposDeEntrada: nuevosTipos, tarifas: nuevasTarifas });
        } else {
            updateEventData({ tiposDeEntrada: nuevosTipos });
        }
    };

    const handleTipoNombreChange = (e) => {
        const newName = e.target.value;
        handleItemChange('tiposDeEntrada', entradaActual, 'nombre', newName);
        // handleItemChange('zonas', entradaActual, 'nombreTipoEntrada', newName);
    };

    // === TARIFAS ===

    // === EFECTO PARA ACTUALIZAR TARIFAS AL CAMBIAR NOMBRE DE TIPO DE ENTRADA ===
    useEffect(() => {
        // Actualizar el nombre en el manejador existente
        const handleTipoNombreChangeEffect = () => {
            if (currentTipoEntrada && currentTipoEntrada.nombre) {
                // Las tarifas se actualizarán automáticamente con handleAsignarPrecioZona
            }
        };
        handleTipoNombreChangeEffect();
    }, [currentTipoEntrada?.nombre]);

    // === FUNCIÓN PARA ASIGNAR PRECIO A UNA ZONA ESPECÍFICA ===
    const handleAsignarPrecioZona = (nombreZona, precio) => {
        const nombreTipoEntrada = currentTipoEntrada.nombre;

        // Validar que el tipo de entrada tenga nombre
        if (!nombreTipoEntrada || nombreTipoEntrada.trim() === '') {
            alert('Debes ingresar un nombre para el tipo de entrada primero');
            return;
        }

        const precioNumerico = Number(precio);

        // Si el precio es 0 o vacío, eliminar la tarifa si existe
        if (!precio || precioNumerico <= 0) {
            const nuevasTarifas = (eventData.tarifas || []).filter(
                t => !(t.tipoEntrada.nombre === nombreTipoEntrada && t.zona.nombre === nombreZona)
            );
            updateEventData({ tarifas: nuevasTarifas });
            return;
        }

        // Buscar si ya existe una tarifa para esta combinación
        const tarifas = eventData.tarifas || [];
        const indiceExistente = tarifas.findIndex(
            t => t.tipoEntrada.nombre === nombreTipoEntrada && t.zona.nombre === nombreZona
        );

        if (indiceExistente >= 0) {
            // Actualizar tarifa existente
            const nuevasTarifas = [...tarifas];
            nuevasTarifas[indiceExistente] = {
                ...nuevasTarifas[indiceExistente],
                precioBase: precioNumerico
            };
            updateEventData({ tarifas: nuevasTarifas });
        } else {
            // Crear nueva tarifa
            const nuevaTarifa = {
                precioBase: precioNumerico,
                tipoEntrada: { nombre: nombreTipoEntrada },
                zona: { nombre: nombreZona }
            };
            updateEventData({ tarifas: [...tarifas, nuevaTarifa] });
        }
    };



    const abrirModalTarifa = () => {
        setNuevaTarifa({ precioBase: 0, tipoEntrada: "", zona: "" });
        setModalTarifaAbierto(true);
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

    const eliminarTarifa = (index) => {
        const nuevasTarifas = (eventData.tarifas || []).filter((_, i) => i !== index);
        updateEventData({ tarifas: nuevasTarifas });
        if (tarifaActual >= nuevasTarifas.length && nuevasTarifas.length > 0) {
            setTarifaActual(nuevasTarifas.length - 1);
        }
    };

    const handleTarifaChange = (index, field, value) => {
        const nuevasTarifas = [...(eventData.tarifas || [])];
        if (field === 'precioBase') {
            nuevasTarifas[index] = { ...nuevasTarifas[index], precioBase: Number(value) };
        }
        updateEventData({ tarifas: nuevasTarifas });
    };

    // === NAVEGACIÓN DE CARRUSELES ===
    const irTemporadaIzq = () => setTemporadaActual(p => (p === 0 ? (eventData.temporadas?.length || 1) - 1 : p - 1));
    const irTemporadaDer = () => setTemporadaActual(p => (p === (eventData.temporadas?.length || 1) - 1 ? 0 : p + 1));
    const irEntradaIzq = () => setEntradaActual(p => (p === 0 ? eventData.tiposDeEntrada.length - 1 : p - 1));
    const irEntradaDer = () => setEntradaActual(p => (p === eventData.tiposDeEntrada.length - 1 ? 0 : p + 1));

    const irTipoEntradaIzq = () => setTipoEntradaActual(p => (p === 0 ? (eventData.tiposDeEntrada?.length || 1) - 1 : p - 1));
    const irTipoEntradaDer = () => setTipoEntradaActual(p => (p === (eventData.tiposDeEntrada?.length || 1) - 1 ? 0 : p + 1));
    const irTarifaIzq = () => setTarifaActual(p => (p === 0 ? (eventData.tarifas?.length || 1) - 1 : p - 1));
    const irTarifaDer = () => setTarifaActual(p => (p === (eventData.tarifas?.length || 1) - 1 ? 0 : p + 1));

    // === FUNCIÓN DE ENVÍO FINAL ===
    const handleFinalSubmit = async () => {
        console.log("Enviando datos finales al backend:", eventData);
        setIsLoading(true);
        let finalImageUrl = null; //La URL de S3 de la imagen que se guardará en la BD
        // Validaciones básicas
        if (!eventData.nombre || !eventData.idCategoria || !eventData.idCiudad) {
            alert("Por favor, completa la información básica del evento");
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
            <div className="header">
                <span className="step">3</span>
                <h2>Crear Entradas</h2>
            </div>

            {/* CONFIGURACIÓN GENERAL */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <label htmlFor="moneda">Moneda</label>
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
                    <label htmlFor="maxCompras">Máximo de compras por ticket</label>
                    <input
                        type="number"
                        id="maxCompras"
                        className="form-control"
                        value={eventData.maxComprasTicket || 4}
                        onChange={handleMaxComprasChange}
                        min="1"
                    />
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
                        <label>Nombre de la temporada</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Preventa, Venta General"
                            value={currentTemporada.nombre}
                            onChange={e => handleItemChange('temporadas', temporadaActual, 'nombre', e.target.value)}
                        />
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

            {/** ENTRADAS */}
            {/* <div className="funciones-section">
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
                    </div> */}
            {/* <div className="col-12 col-md-4">
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
                                    </div> */}
            {/* <div className="col-12">
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
            </div> */}
            {/** ENTRADAS - CREAR TARIFAS POR ZONA */}
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

                <div className="row g-3 rounded-3 p-3" style={{ background: "#eaf7ef" }}>
                    <div className="col-12 col-md-6">
                        <label>Nombre del Tipo de Entrada</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="VIP, Preferencial, Estándar"
                            value={currentTipoEntrada.nombre}
                            onChange={handleTipoNombreChange}
                        />
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
                        <label className="fw-semibold mb-3">Asignar precios por zona:</label>

                        {eventData.zonas && eventData.zonas.length > 0 ? (
                            <div className="row g-3">
                                {eventData.zonas.map((zona, index) => {
                                    // Buscar si ya existe una tarifa para esta combinación
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
                                                    <span className="input-group-text">{currentMoneda === 'SOL' ? 'S/' : '$'}</span>
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


            {/* TIPOS DE ENTRADA */}
            {/* <div className="funciones-section">
                <div className="funciones-header">
                    <h3 className="text-success">Tipos de Entrada</h3>
                    <button className="btn p-0 me-2 text-success fw-semibold" onClick={abrirModalTipoEntrada}>
                        + Agregar tipo de entrada
                    </button>
                </div>

                {eventData.tiposDeEntrada && eventData.tiposDeEntrada.length > 0 ? (
                    <>
                        <div className="funciones-header mt-3">
                            <button className="btn p-0 me-2 text-danger fw-semibold"
                                onClick={() => eliminarTipoEntrada(tipoEntradaActual)}>
                                Eliminar
                            </button>
                            <button className="season-tab__arrow" onClick={irTipoEntradaIzq}>&#60;</button>
                            <span className="fw-bold text-success">
                                Tipo {tipoEntradaActual + 1} de {eventData.tiposDeEntrada.length}
                            </span>
                            <button className="season-tab__arrow" onClick={irTipoEntradaDer}>&#62;</button>
                        </div>

                        <div className="row g-3 rounded-3 p-3 mt-2" style={{ background: "#eaf7ef" }}>
                            <div className="col-12 col-md-6">
                                <label>Nombre del Tipo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="VIP, GENERAL, PALCO"
                                    value={eventData.tiposDeEntrada[tipoEntradaActual]?.nombre || ""}
                                    onChange={e => handleTipoEntradaChange(tipoEntradaActual, 'nombre', e.target.value)}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label>Descripción</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Zona VIP cerca del escenario"
                                    value={eventData.tiposDeEntrada[tipoEntradaActual]?.descripcion || ""}
                                    onChange={e => handleTipoEntradaChange(tipoEntradaActual, 'descripcion', e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-state mt-3">
                        <p>No hay tipos de entrada. Haz clic en "Agregar tipo de entrada".</p>
                    </div>
                )}
            </div> */}

            {/* TARIFAS */}
            {/* <div className="funciones-section">
                <div className="funciones-header">
                    <h3 className="text-success">Tarifas (Precio por Tipo + Zona)</h3>
                    <button
                        className="btn p-0 me-2 text-success fw-semibold"
                        onClick={abrirModalTarifa}
                        disabled={!eventData.zonas?.length || !eventData.tiposDeEntrada?.length}
                    >
                        + Agregar tarifa
                    </button>
                </div>

                {eventData.tarifas && eventData.tarifas.length > 0 ? (
                    <>
                        <div className="funciones-header mt-3">
                            <button className="btn p-0 me-2 text-danger fw-semibold"
                                onClick={() => eliminarTarifa(tarifaActual)}>
                                Eliminar
                            </button>
                            <button className="season-tab__arrow" onClick={irTarifaIzq}>&#60;</button>
                            <span className="fw-bold text-success">
                                Tarifa {tarifaActual + 1} de {eventData.tarifas.length}
                            </span>
                            <button className="season-tab__arrow" onClick={irTarifaDer}>&#62;</button>
                        </div>

                        <div className="row g-3 rounded-3 p-3 mt-2" style={{ background: "#eaf7ef" }}>
                            <div className="col-12 col-md-4">
                                <label>Tipo de Entrada</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={eventData.tarifas[tarifaActual]?.tipoEntrada?.nombre || ""}
                                    disabled
                                    style={{ backgroundColor: '#e9ecef' }}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label>Zona</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={eventData.tarifas[tarifaActual]?.zona?.nombre || ""}
                                    disabled
                                    style={{ backgroundColor: '#e9ecef' }}
                                />
                            </div>
                            <div className="col-12 col-md-4">
                                <label>Precio Base ({currentMoneda})</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={eventData.tarifas[tarifaActual]?.precioBase || 0}
                                    onChange={e => handleTarifaChange(tarifaActual, 'precioBase', e.target.value)}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-state mt-3">
                        <p>No hay tarifas creadas. Define zonas y tipos de entrada primero.</p>
                    </div>
                )}
            </div> */}

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
                        <label>Nombre de la Zona</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="VIP, Platea, General"
                            value={nuevaZona.nombre}
                            onChange={e => setNuevaZona({ ...nuevaZona, nombre: e.target.value })}
                        />
                    </div>
                    <div className="modal-field">
                        <label>Aforo</label>
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
                        <label>Nombre del Tipo</label>
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
                        <label>Tipo de Entrada</label>
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
                        <label>Zona</label>
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
                        <label>Precio Base ({currentMoneda})</label>
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