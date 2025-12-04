import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTarifasByEvento, createTarifa, updateTarifa, deleteTarifa, toggleActivoTarifa } from '../../../../globalServices/TarifaService';
import { getZonasByEvento } from '../../../../globalServices/EventoService';
import { getEntradasByEvento } from '../../../../globalServices/EventoService';
import './GestionTarifas.css';
import './GestionTarifasExtra.css';

export const GestionTarifas = () => {
    const { idEvento } = useParams();
    const navigate = useNavigate();

    const [tarifas, setTarifas] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [tiposEntrada, setTiposEntrada] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState('todas'); // 'activas', 'inactivas', 'todas'

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingTarifa, setEditingTarifa] = useState(null);
    const [deletingTarifa, setDeletingTarifa] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        idZona: '',
        idTipoEntrada: '',
        precioBase: ''
    });

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tarifasData, zonasData, entradasData] = await Promise.all([
                    getTarifasByEvento(idEvento),
                    getZonasByEvento(idEvento),
                    getEntradasByEvento(idEvento)
                ]);

                setTarifas(tarifasData);
                setZonas(zonasData);
                setTiposEntrada(entradasData);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                alert('Error al cargar los datos');
                setLoading(false);
            }
        };
        fetchData();
    }, [idEvento]);

    const handleOpenModal = (tarifa = null) => {
        if (tarifa) {
            setEditingTarifa(tarifa);
            setFormData({
                idZona: tarifa.zonaDTO.idZona,
                idTipoEntrada: tarifa.tipoEntradaDTO.idTipoEntrada,
                precioBase: tarifa.precioBase
            });
        } else {
            setEditingTarifa(null);
            setFormData({
                idZona: '',
                idTipoEntrada: '',
                precioBase: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTarifa(null);
        setFormData({
            idZona: '',
            idTipoEntrada: '',
            precioBase: ''
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.idZona || !formData.idTipoEntrada || !formData.precioBase) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (parseFloat(formData.precioBase) <= 0) {
            alert('El precio debe ser mayor a 0');
            return;
        }

        try {
            setSaving(true);

            const tarifaData = {
                precioBase: parseFloat(formData.precioBase),
                zonaDTO: {
                    idZona: parseInt(formData.idZona)
                },
                tipoEntradaDTO: {
                    idTipoEntrada: parseInt(formData.idTipoEntrada)
                }
            };

            if (editingTarifa) {
                await updateTarifa(editingTarifa.idTarifa, tarifaData);
                alert('Tarifa actualizada correctamente');
            } else {
                await createTarifa(tarifaData);
                alert('Tarifa creada correctamente');
            }

            // Recargar tarifas
            const tarifasData = await getTarifasByEvento(idEvento);
            setTarifas(tarifasData);
            handleCloseModal();
        } catch (error) {
            console.error('Error al guardar tarifa:', error);
            alert('Error al guardar la tarifa');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActivo = async () => {
        if (!deletingTarifa) return;

        try {
            setSaving(true);
            await toggleActivoTarifa(deletingTarifa.idTarifa);

            const tarifasData = await getTarifasByEvento(idEvento);
            setTarifas(tarifasData);
            setDeletingTarifa(null);
            const accion = deletingTarifa.activo ? 'desactivada' : 'activada';
            alert(`Tarifa ${accion} correctamente`);
        } catch (error) {
            console.error('Error al cambiar estado de tarifa:', error);
            alert('Error al cambiar el estado de la tarifa');
        } finally {
            setSaving(false);
        }
    };

    const getNombreZona = (idZona) => {
        const zona = zonas.find(z => z.idZona === idZona);
        return zona ? zona.nombre : '-';
    };

    const getNombreTipoEntrada = (idTipoEntrada) => {
        const tipo = tiposEntrada.find(t => t.idTipoEntrada === idTipoEntrada);
        return tipo ? tipo.nombre : '-';
    };

    // Filtrar tarifas según el estado
    const tarifasFiltradas = tarifas.filter(tarifa => {
        if (filtroEstado === 'activas') return tarifa.activo === true;
        if (filtroEstado === 'inactivas') return tarifa.activo === false;
        return true; // 'todas'
    });

    if (loading) {
        return (
            <div className="gestion-tarifas-container">
                <div className="loading">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="gestion-tarifas-container">
            <div className="header-tarifas">
                <h2>Gestión de Tarifas</h2>
                <button className="btn-volver" onClick={() => navigate(`/organizer/evento/${idEvento}/config`)}>
                    ← Volver
                </button>
            </div>

            {/* Filtros */}
            <div className="filtros-container">
                <div className="filtro">
                    <label>Mostrar:</label>
                    <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option value="activas">Activas</option>
                        <option value="inactivas">Inactivas</option>
                        <option value="todas">Todas</option>
                    </select>
                </div>
            </div>

            <div className="tarifas-actions">
                <button className="btn-agregar" onClick={() => handleOpenModal()}>
                    + Agregar Tarifa
                </button>
            </div>

            <div className="tarifas-table-container">
                {tarifasFiltradas.length === 0 ? (
                    <div className="empty-state">
                        {filtroEstado === 'activas' && 'No hay tarifas activas.'}
                        {filtroEstado === 'inactivas' && 'No hay tarifas inactivas.'}
                        {filtroEstado === 'todas' && 'No hay tarifas configuradas. Agrega una tarifa para empezar.'}
                    </div>
                ) : (
                    <table className="tarifas-table">
                        <thead>
                            <tr>
                                <th>Tipo de Entrada</th>
                                <th>Zona</th>
                                <th>Precio Base</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tarifasFiltradas.map((tarifa) => (
                                <tr key={tarifa.idTarifa}>
                                    <td>{tarifa.tipoEntradaDTO.nombre}</td>
                                    <td>{tarifa.zonaDTO.nombre}</td>
                                    <td>S/ {tarifa.precioBase.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${tarifa.activo ? 'badge-activo' : 'badge-inactivo'}`}>
                                            {tarifa.activo ? '✓ Activa' : '✗ Inactiva'}
                                        </span>
                                    </td>
                                    <td className="acciones">
                                        <button
                                            className="btn-editar"
                                            onClick={() => handleOpenModal(tarifa)}
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className={tarifa.activo ? "btn-eliminar" : "btn-activar"}
                                            onClick={() => setDeletingTarifa(tarifa)}
                                            title={tarifa.activo ? "Desactivar" : "Activar"}
                                        >
                                            {tarifa.activo ? '🗑️' : '✓'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Crear/Editar */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingTarifa ? 'Editar Tarifa' : 'Agregar Tarifa'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Tipo de Entrada</label>
                                <select
                                    value={formData.idTipoEntrada}
                                    onChange={(e) => setFormData({ ...formData, idTipoEntrada: e.target.value })}
                                    required
                                >
                                    <option value="">Selecciona un tipo</option>
                                    {tiposEntrada.map(tipo => (
                                        <option key={tipo.idTipoEntrada} value={tipo.idTipoEntrada}>
                                            {tipo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Zona</label>
                                <select
                                    value={formData.idZona}
                                    onChange={(e) => setFormData({ ...formData, idZona: e.target.value })}
                                    required
                                >
                                    <option value="">Selecciona una zona</option>
                                    {zonas.map(zona => (
                                        <option key={zona.idZona} value={zona.idZona}>
                                            {zona.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Precio Base (S/)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.precioBase}
                                    onChange={(e) => setFormData({ ...formData, precioBase: e.target.value })}
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancelar" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-guardar" disabled={saving}>
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Activar/Desactivar */}
            {deletingTarifa && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{deletingTarifa.activo ? 'Desactivar' : 'Activar'} Tarifa</h3>
                        <p>
                            ¿Estás seguro de {deletingTarifa.activo ? 'desactivar' : 'activar'} la tarifa de <strong>{deletingTarifa.tipoEntradaDTO.nombre}</strong> en <strong>{deletingTarifa.zonaDTO.nombre}</strong>?
                        </p>
                        {deletingTarifa.activo && (
                            <div className="modal-warning">
                                Las tarifas desactivadas no estarán disponibles para la venta de tickets.
                            </div>
                        )}
                        <div className="modal-actions">
                            <button className="btn-cancelar" onClick={() => setDeletingTarifa(null)}>
                                Cancelar
                            </button>
                            <button
                                className={deletingTarifa.activo ? "btn-eliminar-confirm" : "btn-guardar"}
                                onClick={handleToggleActivo}
                                disabled={saving}
                            >
                                {saving ? 'Procesando...' : deletingTarifa.activo ? 'Sí, Desactivar' : 'Sí, Activar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
