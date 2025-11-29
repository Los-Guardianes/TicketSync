import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../../context/AuthContext';
import "./CreateEvent.css";
import { getCateventos } from '../../../../globalServices/EventoService';
import { useEventCreation } from "../../../../context/EventCreationContext";
import { HeaderEvent } from "./Componentes/HeaderEvent";
import { ImageUploader } from "./Componentes/ImageUploader";
import { FunctionsSection } from "./Componentes/Funciones";
import { AlertCircle } from 'lucide-react';

export const CreateEvent = () => {
    const navigate = useNavigate();
    const { eventData, updateEventData } = useEventCreation();
    const { user } = useAuth();
    console.log("Usuario en CreateEvent:", user);
    // Si el usuario es organizador pero no está verificado, mostrar pantalla de bloqueo
    if (user && user.rol === "ORGANIZADOR" && !user.verificado) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
                <div className="text-center p-5 bg-white shadow rounded" style={{ maxWidth: '600px' }}>
                    <div className="mb-4">
                        <span style={{ fontSize: '4rem' }}>⚠️</span>
                    </div>
                    <h2 className="mb-3">Cuenta no verificada</h2>
                    <p className="lead text-muted mb-4">
                        Usted no se encuentra verificado. El equipo de <strong>TuTicket</strong> está trabajando para verificar su cuenta.
                    </p>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/home')}>
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    const [funciones, setFunciones] = useState([
        { id: 1, inicioD: '', inicioH: '', finD: '', finH: '' }
    ]);

    // Estados locales para la UI
    const [catEvento, setCatEvento] = useState([]);
    const [funcionActual, setFuncionActual] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    // Estados de validación (similar al primer código)
    const [errores, setErrores] = useState({});
    const [mostrarErrores, setMostrarErrores] = useState(false);

    // Referencias
    const dragCounter = useRef(0);
    const inputFileRef = useRef(null);

    // Cargar categorías
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

    // === FUNCIONES DE VALIDACIÓN ===

    const validarInformacionBasica = () => {
        const erroresBasicos = {};

        // Validar nombre
        if (!eventData.nombre || eventData.nombre.trim() === "") {
            erroresBasicos.nombre = "El nombre del evento es obligatorio";
        } else if (eventData.nombre.trim().length < 5) {
            erroresBasicos.nombre = "El nombre debe tener al menos 5 caracteres";
        }

        // Validar categoría
        if (!eventData.idCategoria) {
            erroresBasicos.idCategoria = "Debes seleccionar una categoría";
        }

        return erroresBasicos;
    };

    const validarFunciones = () => {
        if (!funciones || funciones.length === 0) {
            return { funciones: "Debes crear al menos una función" };
        }

        const erroresFunciones = {};

        funciones.forEach((funcion, index) => {
            // Validar fecha de inicio
            if (!funcion.inicioD || funcion.inicioD.trim() === "") {
                erroresFunciones[`funcion-${index}-inicioD`] = "La fecha de inicio es obligatoria";
            }

            // Validar hora de inicio
            if (!funcion.inicioH || funcion.inicioH.trim() === "") {
                erroresFunciones[`funcion-${index}-inicioH`] = "La hora de inicio es obligatoria";
            }

            // Validar fecha de fin
            if (!funcion.finD || funcion.finD.trim() === "") {
                erroresFunciones[`funcion-${index}-finD`] = "La fecha de fin es obligatoria";
            }

            // Validar hora de fin
            if (!funcion.finH || funcion.finH.trim() === "") {
                erroresFunciones[`funcion-${index}-finH`] = "La hora de fin es obligatoria";
            }

            // Validar que la fecha/hora de fin sea posterior a la de inicio
            if (funcion.inicioD && funcion.inicioH && funcion.finD && funcion.finH) {
                const fechaHoraInicio = new Date(`${funcion.inicioD}T${funcion.inicioH}`);
                const fechaHoraFin = new Date(`${funcion.finD}T${funcion.finH}`);

                if (fechaHoraFin <= fechaHoraInicio) {
                    erroresFunciones[`funcion-${index}-fechas`] = "La fecha/hora de fin debe ser posterior a la de inicio";
                }
            }

            // Validar que la fecha de inicio no sea en el pasado
            if (funcion.inicioD && funcion.inicioH) {
                const fechaHoraInicio = new Date(`${funcion.inicioD}T${funcion.inicioH}`);
                const ahora = new Date();

                if (fechaHoraInicio < ahora) {
                    erroresFunciones[`funcion-${index}-fechaPasado`] = "La fecha/hora de inicio no puede ser en el pasado";
                }
            }
        });

        return erroresFunciones;
    };

    const validarImagen = () => {
        const erroresImagen = {};

        if (!eventData.imagenFile) {
            erroresImagen.imagen = "Debes cargar una imagen para el evento";
        } else {
            // Validar tipo de archivo
            const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!tiposPermitidos.includes(eventData.imagenFile.type)) {
                erroresImagen.imagen = "El archivo debe ser una imagen (JPG, PNG o WEBP)";
            }

            // Validar tamaño (ej: máximo 5MB)
            const tamañoMaximo = 5 * 1024 * 1024; // 5MB en bytes
            if (eventData.imagenFile.size > tamañoMaximo) {
                erroresImagen.imagen = "La imagen no debe superar los 5MB";
            }
        }

        return erroresImagen;
    };

    const validarFormularioCompleto = () => {
        const erroresValidacion = {
            ...validarInformacionBasica(),
            ...validarFunciones(),
            // ...validarImagen()
        };

        setErrores(erroresValidacion);
        return Object.keys(erroresValidacion).length === 0;
    };

    // === MANEJADORES DE ESTADO ===

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'idCategoria' ? Number(value) : value;
        updateEventData({ [name]: finalValue });

        // Limpiar error específico si existe
        if (errores[name]) {
            const nuevosErrores = { ...errores };
            delete nuevosErrores[name];
            setErrores(nuevosErrores);
        }
    };

    // === LÓGICA DE FUNCIONES ===

    const handleFunctionChange = (id, field, value) => {
        setFunciones(prev =>
            prev.map(func =>
                func.id === id ? { ...func, [field]: value } : func
            )
        );

        // Limpiar errores relacionados con esta función
        const index = funciones.findIndex(f => f.id === id);
        if (index !== -1) {
            const errorKey = `funcion-${index}-${field}`;
            if (errores[errorKey]) {
                const nuevosErrores = { ...errores };
                delete nuevosErrores[errorKey];
                delete nuevosErrores[`funcion-${index}-fechas`];
                delete nuevosErrores[`funcion-${index}-fechaPasado`];
                setErrores(nuevosErrores);
            }
        }
    };

    const addFunction = () => {
        const newId = Math.max(...funciones.map(f => f.id)) + 1;
        setFunciones(prev => [...prev, { id: newId, inicioD: '', inicioH: '', finD: '', finH: '' }]);

        // Limpiar error general de funciones
        if (errores.funciones) {
            const nuevosErrores = { ...errores };
            delete nuevosErrores.funciones;
            setErrores(nuevosErrores);
        }
    };

    const removeFunction = (id) => {
        if (funciones.length > 1) {
            setFunciones(prev => prev.filter(func => func.id !== id));
        } else {
            alert("Debe haber al menos una función");
        }
    };

    // === LÓGICA DE IMAGEN ===

    const handleImagenChange = (file) => {
        updateEventData({ imagenFile: file });

        if (!file && inputFileRef.current) {
            inputFileRef.current.value = '';
        }

        // Validar imagen inmediatamente
        if (file) {
            const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            const tamañoMaximo = 5 * 1024 * 1024;

            if (!tiposPermitidos.includes(file.type)) {
                setErrores(prev => ({
                    ...prev,
                    imagen: "El archivo debe ser una imagen (JPG, PNG o WEBP)"
                }));
                return;
            }

            if (file.size > tamañoMaximo) {
                setErrores(prev => ({
                    ...prev,
                    imagen: "La imagen no debe superar los 5MB"
                }));
                return;
            }

            // Limpiar error si la imagen es válida
            if (errores.imagen) {
                const nuevosErrores = { ...errores };
                delete nuevosErrores.imagen;
                setErrores(nuevosErrores);
            }
        }
    };

    // Drag and Drop handlers
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setDragActive(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        dragCounter.current = 0;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImagenChange(e.dataTransfer.files[0]);
        }
    };

    // === NAVEGACIÓN ===

    const handleNext = () => {
        setMostrarErrores(true);

        // Sincronizar funciones con eventData antes de validar
        const funcionesFormateadas = funciones.map(f => ({
            fechaInicio: f.inicioD,
            horaInicio: f.inicioH,
            fechaFin: f.finD,
            horaFin: f.finH
        }));
        updateEventData({ funciones: funcionesFormateadas });

        // Validar formulario
        if (!validarFormularioCompleto()) {
            alert("Por favor, completa todos los campos obligatorios antes de continuar");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        console.log("Datos guardados en el paso 1:", eventData);
        navigate("/ubicacion-evento");
    };

    return (
        <div className="crear-evento-container">
            {/* Header */}
            <HeaderEvent currentStep={1} />

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

            {/* Form Content */}
            <form className="evento-form" onSubmit={(e) => e.preventDefault()}>
                <div className="basic-info-section">
                    <div className="section-title">Información Básica</div>

                    {/* NOMBRE */}
                    <div className="campo">
                        <label htmlFor="nombre">
                            Nombre del evento <span className="required">*</span>
                        </label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            className={errores.nombre ? 'error' : ''}
                            value={eventData.nombre || ''}
                            onChange={handleChange}
                            placeholder="Ej: Concierto de Rock 2024"
                        />
                        {errores.nombre && (
                            <div className="error-message">{errores.nombre}</div>
                        )}
                        <div className="campo-helper">
                            Ingresa un nombre descriptivo para tu evento
                        </div>
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className="campo">
                        <label htmlFor="descripcion">
                            Descripción del evento
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={eventData.descripcion || ''}
                            onChange={handleChange}
                            placeholder="Escribe una descripción atractiva de tu evento. Incluye detalles importantes como el lugar, actividades, panelistas, links relacionados, etc."
                        />
                        <div className="form-helper">
                            Brinda información completa sobre tu evento para atraer más asistentes
                        </div>
                    </div>

                    {/* CATEGORIA */}
                    <div className="campo">
                        <label htmlFor="idCategoria">
                            Categoría <span className="required">*</span>
                        </label>
                        <select
                            id="idCategoria"
                            name="idCategoria"
                            className={errores.idCategoria ? 'error' : ''}
                            value={eventData.idCategoria || ""}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Selecciona una categoría</option>
                            {catEvento.map((categoria) => (
                                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                        {errores.idCategoria && (
                            <div className="error-message">{errores.idCategoria}</div>
                        )}
                    </div>
                </div>

                {/* FUNCIONES */}
                <div className="funciones-wrapper">
                    {errores.funciones && (
                        <div className="alert alert-warning mb-3" role="alert">
                            <AlertCircle size={16} className="me-2" />
                            {errores.funciones}
                        </div>
                    )}
                    <FunctionsSection
                        funciones={funciones}
                        removeFunction={removeFunction}
                        handleFunctionChange={handleFunctionChange}
                        addFunction={addFunction}
                        errores={errores}
                    />
                </div>

                {/* IMAGEN */}
                <div className="imagen-wrapper">
                    {errores.imagen && (
                        <div className="alert alert-warning mb-3" role="alert">
                            <AlertCircle size={16} className="me-2" />
                            {errores.imagen}
                        </div>
                    )}
                    <ImageUploader
                        file={eventData.imagenFile}
                        dragActive={dragActive}
                        onInputChange={handleImagenChange}
                        onRemove={() => {
                            updateEventData({ imagenFile: null });
                            if (inputFileRef.current) inputFileRef.current.value = "";
                        }}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        inputRef={inputFileRef}
                    />
                </div>
                <div className="basic-info-section">


                    <div className="section-title">Información para los asistentes</div>

                    {/* RESTRICCIONES */}
                    <div className="campo">
                        <label htmlFor="restricciones">Restricciones de acceso</label>
                        <input
                            id="restricciones"
                            type="text"
                            name="restricciones"
                            value={eventData.restricciones || ''}
                            onChange={handleChange}
                            placeholder="Ej: Mayores de 18 años, Entrada con invitación"
                        />
                        <div className="form-helper">
                            Especifica si hay alguna restricción de edad, acceso o requisitos especiales
                        </div>
                    </div>

                    {/* INFORMACION ADICIONAL */}
                    <div className="campo">
                        <label htmlFor="informAdic">Información adicional</label>
                        <textarea
                            id="informAdic"
                            name="informAdic"
                            value={eventData.informAdic || ''}
                            onChange={handleChange}
                            placeholder="Brinde a los usuarios mas información: Detalles del evento, duración aproximada, panelistas, links relacionados, cronograma de eventos, etc."
                        />
                        <div className="form-helper">
                            Añade detalles complementarios que ayuden al público a prepararse mejor para tu evento.
                        </div>
                    </div>
                </div>

                {/* CULMINACION DEL FORM */}
                <div className="form-actions">
                    <button type="button" className="cancel" onClick={() => navigate("/home")}>
                        Cancelar
                    </button>
                    <button type="button" className="next" onClick={handleNext}>
                        Siguiente
                    </button>
                </div>
            </form>
        </div>
    );
};