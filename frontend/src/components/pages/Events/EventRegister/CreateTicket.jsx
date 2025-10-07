import "./CreateTicket.css"
import { useState, useMemo } from "react"
import React from 'react'
import { NavLink } from 'react-router-dom'
// import { NavLink } from '../../../../assets/'

export const CreateTicket = () => {

    const [activeSeason, setActiveSeason] = useState(0);

    function prevSeason() {
        setActiveSeason((i) => Math.max(0, i - 1));
    }
    function nextSeason() {
        setActiveSeason((i) => Math.min(temporadas.length - 1, i + 1));
    }

    const [temporadas, setTemporadas] = useState([
        {
            id: crypto.randomUUID(),
            nombre: "Temporada 1",
            descuento: 0,
            fechaInicio: "",
            fechaFin: "",
            entradas: [
                {
                    id: crypto.randomUUID(),
                    tipo: "",
                    zona: [],
                    precio: 0,
                    maxPorOrden: 10,
                    cantidadDisponible: 0,
                    descripcion: "",
                    seleccionButaca: false,
                    layoutButacas: null,
                },
            ],
        },
    ]);

    // const totalEntradas = useMemo(

    // )

    function addTemporada() {
        setTemporada((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                nombre: `Temporada ${prev.length + 1}`,
                descuento: 0,
                fechaInicio: "",
                fechaFin: "",
                entradas: [
                    {
                        id: crypto.randomUUID(),
                        tipo: "",
                        zona: [],
                        precio: 0,
                        maxPorOrden: 10,
                        cantidadDisponible: 0,
                        descripcion: "",
                        seleccionButaca: false,
                        layoutButacas: null,
                    },
                ],
            },
        ])
    }

    function removeTemporada(tid) {
        setTemporadas((prev) => prev.filter((t) => t.id !== tid));
    }

    return (
        <div>
            <div className='fe-page'>
                <div className='fe-card'>
                    {/* Header */}
                    <div className='fe-header'>
                        <div className='fe-badge'>3</div>
                        <div className='fe-title'>Crear Entradas</div>
                    </div>
                    <div>
                        <div className="fe-content">
                            {/* Moneda */}
                            <div className="fe-block">
                                <label htmlFor="moneda" className="form-label">Moneda</label>
                                <select className="form-select w-auto" id="moneda"
                                >
                                    <option value="">Elige un tipo de moneda</option>
                                    <option value="PEN">S/ (PEN)</option>
                                    <option value="USD">$ (USD)</option>
                                    <option value="EUR">€ (EUR)</option>
                                </select>
                            </div>
                            {/* Temporadas */}
                            {temporadas.map((t, idx) => (
                                <div key={t.id} className="fe-season mb-3">
                                    {/* Pestaña (solo estética por temporada) */}
                                    <div className="season-tab">
                                        <button className="btn p-0 me-2 text-success fw-semibold" onClick={addTemporada}>
                                            + Agregar temporada
                                        </button>

                                        <button className="season-tab__arrow" onClick={prevSeason}
                                            disabled={activeSeason === 0}
                                            aria-label="Anterior">‹</button>
                                        
                                        <span className="fw-bold text-success">Temporada{idx + 1}</span>

                                        <button className="season-tab__arrow" onClick={nextSeason}
                                            disabled={activeSeason === temporadas.length - 1}
                                            aria-label="Siguiente">›</button>
                                    </div>

                                    {/* Campos de ESTA temporada (t) */}
                                    <div className="row g-3 rounded-3 p-3" style={{ background: "#eaf7ef" }}>
                                        <div className="col-12 col-md-4">
                                            <label htmlFor={`nombre-${t.id}`} className="form-label">Nombre de la temporada</label>
                                            <input
                                                id={`nombre-${t.id}`} className="form-control" placeholder="Escribe la temporada"
                                                value={t.nombre} onChange={(e) => updateTemporada(t.id, { nombre: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-12 col-md-2">
                                            <label htmlFor={`desc-${t.id}`} className="form-label">Descuento</label>
                                            <input
                                                id={`desc-${t.id}`} type="number" step="0.01" className="form-control" placeholder="0.00"
                                                value={t.descuento ?? ""} onChange={(e) => updateTemporada(t.id, { descuento: e.target.value === "" ? "" : Number(e.target.value) })}
                                            />
                                        </div>

                                        <div className="col-12 col-md-3">
                                            <label htmlFor={`ini-${t.id}`} className="form-label">Fecha de Inicio</label>
                                            <input
                                                id={`ini-${t.id}`} type="date" className="form-control"
                                                value={t.fechaInicio ?? ""} onChange={(e) => updateTemporada(t.id, { fechaInicio: e.target.value })}
                                            />
                                        </div>

                                        <div className="col-12 col-md-3">
                                            <label htmlFor={`fin-${t.id}`} className="form-label">Fecha de Fin</label>
                                            <input
                                                id={`fin-${t.id}`} type="date" className="form-control"
                                                value={t.fechaFin ?? ""} onChange={(e) => updateTemporada(t.id, { fechaFin: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}



                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

