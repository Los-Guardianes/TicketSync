import React, { useState, useEffect } from "react";
import { getCategorias, postCategoria, putCategoria, deleteCategoria } from "../service/CategoryService";
import { useNavigate } from 'react-router-dom';
import "./ConfigUsers.css";

export const ConfigCategorias = () => {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [filterComision, setFilterComision] = useState("");
    const [filterEstado, setFilterEstado] = useState(""); // "", "activo", "inactivo"
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        comision: ""
    });

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const data = await getCategorias();
                setCategorias(data);
                setFilteredCategorias(data);
            } catch (err) {
                console.error("Error al obtener categorías", err);
                alert("No se pudieron cargar las categorías.");
            }
        };
        fetchCategorias();
    }, [reloadTrigger]);

    useEffect(() => {
        let filtered = [...categorias];

        // Filtrar por estado (activo/inactivo)
        if (filterEstado === "activo") {
            filtered = filtered.filter(c => c.activo === true);
        } else if (filterEstado === "inactivo") {
            filtered = filtered.filter(c => c.activo === false);
        }

        // Filtrar por comision
        if (filterComision === "con") {
            filtered = filtered.filter(c => c.comision != null && c.comision > 0);
        } else if (filterComision === "sin") {
            filtered = filtered.filter(c => c.comision == null || c.comision === 0);
        }

        setFilteredCategorias(filtered);
    }, [filterComision, filterEstado, categorias]);

    const handleAddCategoria = async () => {
        try {
            if (!formData.nombre.trim()) {
                alert("El nombre es obligatorio.");
                return;
            }

            const payload = {
                nombre: formData.nombre.trim(),
                comision: formData.comision === "" ? null : Number(formData.comision),
                activo: true
            };

            if (payload.comision !== null && (payload.comision < 0 || payload.comision > 100)) {
                alert("La comisión debe estar entre 0 y 100.");
                return;
            }

            await postCategoria(payload);
            alert("Categoría creada correctamente.");
            setShowAddModal(false);
            setFormData({ nombre: "", comision: "" });
            setReloadTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Error al crear categoría", err);
            alert("No se pudo crear la categoría.");
        }
    };

    const handleEditCategoria = async () => {
        try {
            if (!formData.nombre.trim()) {
                alert("El nombre es obligatorio.");
                return;
            }

            const payload = {
                nombre: formData.nombre.trim(),
                comision: formData.comision === "" ? null : Number(formData.comision),
                activo: categoriaSeleccionada.activo
            };

            if (payload.comision !== null && (payload.comision < 0 || payload.comision > 100)) {
                alert("La comisión debe estar entre 0 y 100.");
                return;
            }

            await putCategoria(payload, categoriaSeleccionada.idCategoria);
            alert("Categoría actualizada correctamente.");
            setShowEditModal(false);
            setCategoriaSeleccionada(null);
            setFormData({ nombre: "", comision: "" });
            setReloadTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Error al actualizar categoría", err);
            alert("No se pudo actualizar la categoría.");
        }
    };

    const handleToggleCategoria = async (categoria) => {
        const isActivating = !categoria.activo;
        const action = isActivating ? 'Activar' : 'Desactivar';

        const confirm = window.confirm(
            action + ' la categoría "' + categoria.nombre + '"?' +
            (isActivating ? '' : '\n\nNota: La categoría seguirá visible en la lista pero marcada como inactiva.')
        );
        if (!confirm) return;

        try {
            const payload = {
                nombre: categoria.nombre,
                comision: categoria.comision,
                activo: isActivating
            };

            await putCategoria(payload, categoria.idCategoria);
            alert("Categoría " + (isActivating ? "activada" : "desactivada") + " correctamente.");
            setReloadTrigger(prev => prev + 1);
        } catch (err) {
            console.error("Error al " + (isActivating ? "activar" : "desactivar") + " categoría", err);
            alert("No se pudo " + (isActivating ? "activar" : "desactivar") + " la categoría.");
        }
    };

    const openEditModal = (categoria) => {
        setCategoriaSeleccionada(categoria);
        setFormData({
            nombre: categoria.nombre,
            comision: categoria.comision != null ? categoria.comision.toString() : ""
        });
        setShowEditModal(true);
    };

    return (
        <div className="config-users-wrapper">
            <div className="config-users-container" style={{
                maxWidth: '1000px',
                margin: '0 auto',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                padding: '20px'
            }}>
                <div className="d-flex justify-content-start mb-3">
                    <button className="btn btn-outline-primary w-auto" onClick={() => navigate("/home-admin")}>
                        ← Volver
                    </button>
                </div>

                <h3 className="mb-2">Gestión de Categorías</h3>
                <p className="mb-4" style={{ fontSize: '0.95rem', color: '#6c757d' }}>
                    Administra las categorías de eventos y sus comisiones.
                </p>

                <div className="card shadow-sm mb-3">
                    <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <div className="d-flex gap-2 align-items-center flex-wrap">
                                <label className="mb-0 text-muted small">Filtrar por:</label>
                                <select
                                    value={filterEstado}
                                    onChange={(e) => setFilterEstado(e.target.value)}
                                    className="form-select form-select-sm"
                                    style={{ width: 'auto', minWidth: '130px' }}
                                >
                                    <option value="">Todas</option>
                                    <option value="activo">Activas</option>
                                    <option value="inactivo">Inactivas</option>
                                </select>
                                <select
                                    value={filterComision}
                                    onChange={(e) => setFilterComision(e.target.value)}
                                    className="form-select form-select-sm"
                                    style={{ width: 'auto', minWidth: '150px' }}
                                >
                                    <option value="">Todas las comisiones</option>
                                    <option value="con">Con comisión</option>
                                    <option value="sin">Sin comisión</option>
                                </select>
                            </div>
                            <button className="btn btn-success btn-sm" onClick={() => setShowAddModal(true)}>
                                <i className="bi bi-plus-circle me-2"></i>
                                Agregar Categoría
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0" style={{ verticalAlign: 'middle' }}>
                                <thead style={{ backgroundColor: '#f8f9fa' }}>
                                    <tr>
                                        <th className="px-4 py-3 fw-semibold border-bottom">Nombre</th>
                                        <th className="px-4 py-3 fw-semibold border-bottom">Comisión</th>
                                        <th className="px-4 py-3 fw-semibold border-bottom text-center">Estado</th>
                                        <th className="px-4 py-3 fw-semibold border-bottom text-center" style={{ minWidth: '220px' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategorias.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5">
                                                <div className="text-muted">
                                                    <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary opacity-50"></i>
                                                    <span className="fs-6">No hay categorías para mostrar</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCategorias.map((cat) => (
                                            <tr key={cat.idCategoria} style={{ opacity: cat.activo ? 1 : 0.6 }}>
                                                <td className="px-4 py-3">
                                                    <span className="fw-semibold">{cat.nombre}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cat.comision != null && cat.comision > 0
                                                        ? <span className="badge bg-success px-3 py-2" style={{ fontSize: '0.875rem' }}>
                                                            <i className="bi bi-percent me-1"></i>{cat.comision}%
                                                        </span>
                                                        : <span className="text-muted fst-italic" style={{ fontSize: '0.9rem' }}>Sin comisión</span>}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`badge ${cat.activo ? 'bg-success' : 'bg-secondary'} px-3 py-2`} style={{ fontSize: '0.875rem' }}>
                                                        {cat.activo ? 'Activa' : 'Inactiva'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => openEditModal(cat)}
                                                            style={{ minWidth: '85px' }}
                                                        >
                                                            <i className="bi bi-pencil-square me-1"></i>
                                                            Editar
                                                        </button>
                                                        <button
                                                            className={`btn btn-sm ${cat.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                                            onClick={() => handleToggleCategoria(cat)}
                                                            style={{ minWidth: '100px' }}
                                                        >
                                                            <i className={`bi ${cat.activo ? 'bi-x-circle' : 'bi-arrow-clockwise'} me-1`}></i>
                                                            {cat.activo ? 'Desactivar' : 'Activar'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showAddModal && (
                <div className="add-user-modal-overlay">
                    <div className="add-user-modal">
                        <h4>Agregar Nueva Categoría</h4>
                        <div className="add-user-form">
                            <input
                                type="text"
                                placeholder="Nombre de la categoria *"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Comision (%) - Opcional"
                                value={formData.comision}
                                onChange={(e) => setFormData({ ...formData, comision: e.target.value })}
                                min="0"
                                max="100"
                                step="0.01"
                            />
                            <small className="text-muted">
                                La comisión es opcional. Dejar vacío para categorías sin comisión.
                            </small>
                        </div>
                        <div className="add-user-modal-actions">
                            <button className="btn-cancelar-outline" onClick={() => {
                                setShowAddModal(false);
                                setFormData({ nombre: "", comision: "" });
                            }}>
                                Cancelar
                            </button>
                            <button className="btn-confirmar" onClick={handleAddCategoria}>
                                Crear Categoría
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && categoriaSeleccionada && (
                <div className="add-user-modal-overlay">
                    <div className="add-user-modal">
                        <h4>Editar Categoría</h4>
                        <div className="add-user-form">
                            <input
                                type="text"
                                placeholder="Nombre de la categoria *"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Comision (%) - Opcional"
                                value={formData.comision}
                                onChange={(e) => setFormData({ ...formData, comision: e.target.value })}
                                min="0"
                                max="100"
                                step="0.01"
                            />
                            <small className="text-muted">
                                La comisión es opcional. Dejar vacío para categorías sin comisión.
                            </small>
                        </div>
                        <div className="add-user-modal-actions">
                            <button className="btn-cancelar-outline" onClick={() => {
                                setShowEditModal(false);
                                setCategoriaSeleccionada(null);
                                setFormData({ nombre: "", comision: "" });
                            }}>
                                Cancelar
                            </button>
                            <button className="btn-confirmar" onClick={handleEditCategoria}>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
