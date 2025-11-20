import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UbicacionEvento.css";
import { useEventCreation } from "../../../../context/EventCreationContext";
// Asumo que tienes un servicio para la ubicación, ajústalo a tu proyecto real
import { getDepartamentos, getCiudadesPorDpto } from '../../../../globalServices/UbicacionService';
import { HeaderEvent } from "./Componentes/HeaderEvent";


export const UbicacionEvento = () => {
    const navigate = useNavigate();
    // 1. Usas el contexto como única fuente de verdad para los datos
    const { eventData, updateEventData } = useEventCreation();

    // 2. Estados locales para manejar la UI (poblar selects, drag-drop)
    const [departamentos, setDepartamentos] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [selectedDpto, setSelectedDpto] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const inputFileRef = useRef(null);
    const dragCounter = useRef(0);

    // Cargar la lista de departamentos cuando el componente se monta
    useEffect(() => {
        const fetchDepartamentos = async () => {
            try {
                const data = await getDepartamentos();
                setDepartamentos(data);
            } catch (error) {
                console.error("Error al cargar departamentos:", error);
            }
        };
        fetchDepartamentos();
    }, []);

    // Cargar la lista de ciudades cada vez que el usuario elige un departamento
    useEffect(() => {
        if (selectedDpto) {
            const fetchCiudades = async () => {
                try {
                    const data = await getCiudadesPorDpto(selectedDpto);
                    setCiudades(data);
                } catch (error) {
                    console.error("Error al cargar ciudades:", error);
                    setCiudades([]); // Limpia en caso de error
                }
            };
            fetchCiudades();
        } else {
            setCiudades([]); // Si no hay departamento, no hay ciudades
        }
    }, [selectedDpto]);

    // --- MANEJADORES DE ESTADO (Actualizan el contexto) ---

    // Función genérica para el input de dirección y el select de ciudad
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convertimos el value a número si es el idCiudad
        const finalValue = name === 'idCiudad' ? Number(value) : value;
        updateEventData({ [name]: finalValue });
    };

    // Manejador específico para el cambio de departamento
    const handleDptoChange = (e) => {
        const dptoId = e.target.value;
        setSelectedDpto(dptoId);
        // Importante: Resetea la ciudad en el contexto cuando cambia el departamento
        updateEventData({ idCiudad: null });
    };

    // Manejador para el archivo del mapa
    const handleMapaChange = (file) => {
        updateEventData({ mapaFile: file });
    };

    // Lógica de Drag and Drop (sin cambios en su funcionamiento)
    const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter.current++; setDragActive(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); dragCounter.current--; if (dragCounter.current === 0) { setDragActive(false); } };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleMapaChange(e.dataTransfer.files[0]);
        }
    };

    const handleNext = () => {
        console.log("Datos acumulados hasta el paso 2:", eventData);
        navigate("/create-ticket"); // Navega al siguiente paso
    };

    return (
        <>
            <div className="ubicacion-evento-container">
                {/* Header */}
                <HeaderEvent currentStep={2} />
                
                {/* <div className="header">
                    <span className="step">2</span>
                    <h2>Ubicación</h2>
                </div> */}


                <form className="ubicacion-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="basic-info-section">
                        <div className="section-title">UBICACIÓN</div>
                        <div className="campo">
                            
                        </div>
                    </div>
                    <div className="form-content">
                        <div className="form-left">
                            <div className="campo">
                                <label htmlFor="departamento">Departamento</label>
                                <select id="departamento" value={selectedDpto} onChange={handleDptoChange}>
                                    <option value="">Elige un departamento</option>
                                    {departamentos.map(dpto => (
                                        <option key={dpto.idDpto} value={dpto.idDpto}>{dpto.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="campo">
                                <label htmlFor="idCiudad">Ciudad</label>
                                <select
                                    id="idCiudad"
                                    name="idCiudad"
                                    value={eventData.idCiudad || ""}
                                    onChange={handleChange}
                                    disabled={!selectedDpto || ciudades.length === 0}
                                >
                                    <option value="">Elige una ciudad</option>
                                    {ciudades.map(ciudad => (
                                        <option key={ciudad.idCiudad} value={ciudad.idCiudad}>{ciudad.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="campo">
                                <label htmlFor="direccion">Dirección</label>
                                <input
                                    id="direccion"
                                    name="direccion"
                                    type="text"
                                    value={eventData.direccion}
                                    onChange={handleChange}
                                    placeholder="Escribe la dirección del evento"
                                />
                            </div>
                        </div>
                        <div className="form-right">
                            <div className="campo">
                                <label htmlFor="mapa">Mapa de referencia</label>
                                <div
                                    className={`mapa-placeholder${dragActive ? ' drag-active' : ''}`}
                                    onClick={() => inputFileRef.current?.click()}
                                    onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver} onDrop={handleDrop}
                                    style={{ cursor: 'pointer', position: 'relative', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {eventData.mapaFile ? (
                                        <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img
                                                src={URL.createObjectURL(eventData.mapaFile)}
                                                alt="Mapa de referencia"
                                                style={{ maxWidth: '300px', maxHeight: '160px', objectFit: 'contain', borderRadius: '8px', margin: '0 auto' }}
                                            />
                                            <button
                                                type="button" onClick={(e) => { e.stopPropagation(); handleMapaChange(null); }}
                                                style={{ position: 'absolute', top: 8, right: 8, background: '#fff', color: '#d32f2f', border: '1px solid #d32f2f', borderRadius: '50%', width: '32px', height: '32px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', zIndex: 3 }}
                                                title="Eliminar mapa"
                                            >×</button>
                                        </div>
                                    ) : (
                                        !dragActive && <span style={{ color: '#219653', fontWeight: 500, fontSize: '1.2rem', textAlign: 'center' }}>+ Añade un mapa</span>
                                    )}
                                    <input
                                        type="file" accept="image/*" ref={inputFileRef} style={{ display: 'none' }}
                                        onChange={(e) => e.target.files && e.target.files[0] && handleMapaChange(e.target.files[0])}
                                    />
                                    {dragActive && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(33,150,83,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#219653', fontWeight: 600, fontSize: '1.1rem', zIndex: 2 }}>Suelta el mapa aquí</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="cancel" onClick={() => navigate("/create-event")}>Regresar</button>
                        <button type="button" className="next" onClick={handleNext}>Siguiente</button>
                    </div>
                </form>
            </div>
        </>
    );
};