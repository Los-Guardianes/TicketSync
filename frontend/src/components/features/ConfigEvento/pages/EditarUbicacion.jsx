import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../CreateEvent/pages/UbicacionEvento.css";
import { getDepartamentos, getCiudadesPorDpto } from '../../../../globalServices/UbicacionService';
import { getEventosById } from '../../../../globalServices/EventoService';
import { apiFetch } from '../../../../globalServices/API';

export const EditarUbicacion = () => {
    const navigate = useNavigate();
    const { idEvento } = useParams();

    // Estados locales para datos del formulario
    const [direccion, setDireccion] = useState("");
    const [idCiudad, setIdCiudad] = useState(null);
    const [mapaFile, setMapaFile] = useState(null);
    const [mapaUrl, setMapaUrl] = useState("");
    const [eventoCompleto, setEventoCompleto] = useState(null);
    // Estados para UI
    const [departamentos, setDepartamentos] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [selectedDpto, setSelectedDpto] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const inputFileRef = useRef(null);
    const dragCounter = useRef(0);

    // Cargar datos del evento al montar
    useEffect(() => {
        const fetchEvento = async () => {
            try {
                const evento = await getEventosById(idEvento);
                setEventoCompleto(evento); // ✅ Guardar evento completo
                setDireccion(evento.direccion || "");
                setIdCiudad(evento.ciudad?.idCiudad || null);
                setMapaUrl(evento.mapa || "");

                // Si tiene ciudad, obtener su departamento
                if (evento.ciudad?.idCiudad) {
                    setSelectedDpto(evento.ciudad.dpto?.idDpto || "");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar evento:", error);
                alert("No se pudo cargar el evento");
                setLoading(false);
            }
        };
        fetchEvento();
    }, [idEvento]);
    // Cargar departamentos
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

    // Cargar ciudades cuando cambia departamento
    useEffect(() => {
        if (selectedDpto) {
            const fetchCiudades = async () => {
                try {
                    const data = await getCiudadesPorDpto(selectedDpto);
                    setCiudades(data);
                } catch (error) {
                    console.error("Error al cargar ciudades:", error);
                    setCiudades([]);
                }
            };
            fetchCiudades();
        } else {
            setCiudades([]);
        }
    }, [selectedDpto]);

    // Handlers
    const handleDptoChange = (e) => {
        const dptoId = e.target.value;
        setSelectedDpto(dptoId);
        setIdCiudad(null); // Reset ciudad
    };

    const handleCiudadChange = (e) => {
        setIdCiudad(Number(e.target.value));
    };

    const handleDireccionChange = (e) => {
        setDireccion(e.target.value);
    };

    const handleMapaChange = (file) => {
        setMapaFile(file);
    };

    // Drag and Drop
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

    const handleSave = async () => {
        if (!idCiudad) {
            alert("Debes seleccionar una ciudad");
            return;
        }
        if (!direccion.trim()) {
            alert("Debes ingresar una dirección");
            return;
        }

        try {
            setSaving(true);

            // Preparar datos para actualizar
            const updateData = {
                idEvento: parseInt(idEvento),
                nombre: eventoCompleto.nombre,
                descripcion: eventoCompleto.descripcion,
                direccion: direccion, // Campo actualizado
                restricciones: eventoCompleto.restricciones,
                informAdic: eventoCompleto.informAdic,
                moneda: eventoCompleto.moneda,
                maxComprasTickets: eventoCompleto.maxComprasTickets,
                activo: eventoCompleto.activo,
                ciudad: {
                    idCiudad: idCiudad // Campo actualizado
                },
                categoria: {
                    idCategoria: eventoCompleto.categoria.idCategoria
                },
                organizador: {
                    idUsuario: eventoCompleto.organizador?.idUsuario || JSON.parse(localStorage.getItem('user'))?.idUsuario
                }
            };

            // Si hay nuevo mapa, enviarlo
            if (mapaFile) {
                const formData = new FormData();
                formData.append("mapa", mapaFile);
                formData.append("datos", JSON.stringify(updateData));

                await apiFetch(`/api/evento/${idEvento}`, {
                    method: 'PUT',
                    body: formData,
                    headers: {} // FormData maneja sus propios headers
                });
            } else {
                // Solo actualizar datos sin mapa
                await apiFetch(`/api/evento/${idEvento}`, {
                    method: 'PUT',
                    body: JSON.stringify(updateData)
                });
            }

            alert("Ubicación actualizada correctamente");
            navigate(`/organizer/evento/${idEvento}/config`)
        } catch (error) {
            console.error("Error al actualizar ubicación:", error);
            alert("No se pudo actualizar la ubicación");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="ubicacion-evento-container">
                <div className="basic-info-section">
                    <div className="section-title">Cargando...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="ubicacion-evento-container">
            <div className="header">
                <h2>Editar Ubicación del Evento</h2>
            </div>

            <form className="ubicacion-form" onSubmit={(e) => e.preventDefault()}>
                <div className="basic-info-section">
                    <div className="section-title">UBICACIÓN</div>
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
                                value={idCiudad || ""}
                                onChange={handleCiudadChange}
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
                                value={direccion}
                                onChange={handleDireccionChange}
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
                                {mapaFile || mapaUrl ? (
                                    <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img
                                            src={mapaFile ? URL.createObjectURL(mapaFile) : mapaUrl}
                                            alt="Mapa de referencia"
                                            style={{ maxWidth: '300px', maxHeight: '160px', objectFit: 'contain', borderRadius: '8px', margin: '0 auto' }}
                                        />
                                        <button
                                            type="button" onClick={(e) => { e.stopPropagation(); handleMapaChange(null); setMapaUrl(""); }}
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
                    <button type="button" className="cancel" onClick={() => navigate(`/organizer/evento/${idEvento}/config`)}>
                        Cancelar
                    </button>
                    <button type="button" className="next" onClick={handleSave} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form >
        </div >
    );
};
