import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../../globalServices/API";
import { getCateventos } from "../../../../globalServices/EventoService";

import "./EditEvent.css";

export const EditEvent = () => {
    const { idEvento } = useParams();
    const navigate = useNavigate();

    const [cargando, setCargando] = useState(true);
    const [catEvento, setCatEvento] = useState([]);

    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        informAdic: "",
        restricciones: "",
        idCategoria: "",
    });

    const [initialForm, setInitialForm] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categorias = await getCateventos();
                setCatEvento(categorias);

                const evento = await apiFetch(`/api/evento/${idEvento}`);

                const data = {
                    nombre: evento.nombre || "",
                    descripcion: evento.descripcion || "",
                    informAdic: evento.informAdic || "",
                    restricciones: evento.restricciones || "",
                    idCategoria: evento.categoria?.idCategoria || "",
                };

                setForm(data);
                setInitialForm(data);

            } catch (err) {
                console.error("Error cargando datos:", err);
                alert("No se pudo cargar el evento.");
            } finally {
                setCargando(false);
            }
        };

        fetchData();
    }, [idEvento]);
    // Manejar cambios del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Limpia espacios antes de comparar
    const normalize = (obj) => {
        const cleaned = { ...obj };
        Object.keys(cleaned).forEach((key) => {
            if (typeof cleaned[key] === "string") {
                cleaned[key] = cleaned[key].trim();
            }
        });
        return cleaned;
    };

    // Guardar cambios
    const handleSave = async () => {
        const initialClean = normalize(initialForm);
        const formClean = normalize(form);

        // Si nada cambió → mensaje simple
        if (JSON.stringify(initialClean) === JSON.stringify(formClean)) {
            alert("No has realizado cambios.");
            return;
        }

        try {
            const payload = {
                nombre: form.nombre,
                descripcion: form.descripcion,
                informAdic: form.informAdic,
                restricciones: form.restricciones,
                categoria: {
                    idCategoria: Number(form.idCategoria)
                }
            };
            

            await apiFetch(`/api/evento/${idEvento}`, {
                method: "PUT",
                body: JSON.stringify(payload)
            });

            alert("Evento actualizado con éxito.");

            navigate(`/organizer/evento/${idEvento}/config`);

        } catch (error) {
            console.error(error);
            alert("Error al guardar los cambios.");
        }
    };

    // Cancelar
    const handleCancel = () => {
        navigate(`/organizer/evento/${idEvento}/config`);
    };

    if (cargando) return <p>Cargando...</p>;
    return (
        <div className="crear-evento-container">

            <div className="header">
                <span className="step">
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
                <h2>Editar detalles del evento</h2>
            </div>

            <form className="evento-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-content">

                    {/* IZQUIERDA */}
                    <div className="form-left">

                        <div className="campo">
                            <label>Nombre del evento</label>
                            <input
                                name="nombre"
                                type="text"
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder="Nombre del evento"
                            />
                        </div>

                        <div className="campo">
                            <label>Categoría</label>
                            <select
                                name="idCategoria"
                                value={form.idCategoria}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una categoría</option>
                                {catEvento.map((cat) => (
                                    <option key={cat.idCategoria} value={cat.idCategoria}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="campo">
                            <label>Restricciones</label>
                            <input
                                name="restricciones"
                                type="text"
                                value={form.restricciones}
                                onChange={handleChange}
                                placeholder="Ej: No menores"
                            />
                        </div>

                        <div className="campo">
                            <label>Descripción</label>
                            <textarea
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleChange}
                                placeholder="Describe tu evento"
                            />
                        </div>

                    </div>

                    {/* DERECHA */}
                    <div className="form-right">

                        <div className="campo">
                            <label>Información adicional</label>
                            <textarea
                                name="informAdic"
                                value={form.informAdic}
                                onChange={handleChange}
                                placeholder="Duración, cronograma, panelistas, etc."
                            />
                        </div>

                        <div className="campo">
                            <label className="disabled-info">
                                La imagen del evento no se edita aún (pendiente)
                            </label>
                        </div>

                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel" onClick={handleCancel}>
                        Cancelar
                    </button>

                    <button type="button" className="next" onClick={handleSave}>
                        Guardar cambios
                    </button>
                </div>

            </form>
        </div>
    );
};
