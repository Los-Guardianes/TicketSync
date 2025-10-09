import "./CreateTicket.css"
import { useState, useMemo } from "react"
import React from 'react'
import { NavLink } from 'react-router-dom'
// import { NavLink } from '../../../../assets/'

export const CreateTicket = () => {

    const [activeSeason, setActiveSeason] = useState(0);
    const [funciones, setFunciones] = useState([{ inicio: "", fin: "" }]);
    // const [funcionActual, setFuncionActual] = useState(0);
    const [temporadaActual, setTemporadaActual] = useState(0);
    const [entradaActual, setEntradaActual] = useState(0);

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
    const handleNameTempChange = (event) => {
        const nuevas = [...temporadas];
        nuevas[temporadaActual] = {
            ...nuevas[temporadaActual],
            nombre: event.target.value
        };
        setTemporadas(nuevas);
    }
    const handleDescTempChange = (event) => {
        const nuevas = [...temporadas];
        nuevas[temporadaActual] = {
            ...nuevas[temporadaActual],
            descuento: event.target.value
        };
        setTemporadas(nuevas);
    }
    const handleFIniTempChange = (event) => {
        const nuevas = [...temporadas];
        nuevas[temporadaActual] = {
            ...nuevas[temporadaActual],
            fechaInicio: event.target.value
        };
        setTemporadas(nuevas);
    }
    const handleFFinTempChange = (event) => {
        const nuevas = [...temporadas];
        nuevas[temporadaActual] = {
            ...nuevas[temporadaActual],
            fechaFin: event.target.value
        };
        setTemporadas(nuevas);
    }

    const addTemporada = () => {
        setTemporadas([
            ...temporadas,
            {
                id: crypto.randomUUID(),
                nombre: `Temporada ${temporadas.length + 1}`,
                descuento: 0,
                fechaInicio: "",
                fechaFin: "",
                entradas: [
                    {
                        id: crypto.randomUUID(),
                        tipo: "a",
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
        setTemporadaActual(temporadas.length);
    }
    function removeTemporada(tid) {
        setTemporadas((prev) => prev.filter((t) => t.id !== tid));
    }

    // ENTRADAS

    const handleTipoEntrChange = (event) => {
        const nuevas = [...temporadas];
        const temporada = { ...nuevas[temporadaActual] };
        const entradas = [...temporada.entradas];
        entradas[entradaActual] = {
            ...entradas[entradaActual],
            tipo: event.target.value,
        };
        temporada.entradas = entradas;
        nuevas[temporadaActual] = temporada;

        setTemporadas(nuevas);
    }

    const handleZonaEntrChange = (event) => {
        const nuevas = [...temporadas];
        const temporada = { ...nuevas[temporadaActual] };
        const entradas = [...temporada.entradas];
        entradas[entradaActual] = {
            ...entradas[entradaActual],
            zona: event.target.value,
        };
        temporada.entradas = entradas;
        nuevas[temporadaActual] = temporada;

        setTemporadas(nuevas);
    }

    const handleDescuentoEntrChange = (event) => {
        const nuevas = [...temporadas];
        const temporada = { ...nuevas[temporadaActual] };
        const entradas = [...temporada.entradas];
        entradas[entradaActual] = {
            ...entradas[entradaActual],
            descuento: event.target.value,
        };
        temporada.entradas = entradas;
        nuevas[temporadaActual] = temporada;

        setTemporadas(nuevas);
    }

    const handleMaxEntrChange = (event) => {
        const nuevas = [...temporadas];
        const temporada = { ...nuevas[temporadaActual] };
        const entradas = [...temporada.entradas];
        entradas[entradaActual] = {
            ...entradas[entradaActual],
            maxPorOrden: event.target.value,
        };
        temporada.entradas = entradas;
        nuevas[temporadaActual] = temporada;

        setTemporadas(nuevas);
    }

    const handleCantEntrChange = (event) => {
        const nuevas = [...temporadas];
        const temporada = { ...nuevas[temporadaActual] };
        const entradas = [...temporada.entradas];
        entradas[entradaActual] = {
            ...entradas[entradaActual],
            cantidadDisponible: event.target.value,
        };
        temporada.entradas = entradas;
        nuevas[temporadaActual] = temporada;

        setTemporadas(nuevas);
    }

    const handleDescripcionEntrChange = (event) => {
        const nuevas = [...temporadas];
        const temporada = { ...nuevas[temporadaActual] };
        const entradas = [...temporada.entradas];
        entradas[entradaActual] = {
            ...entradas[entradaActual],
            descripcion: event.target.value,
        };
        temporada.entradas = entradas;
        nuevas[temporadaActual] = temporada;

        setTemporadas(nuevas);
    }
    const handleButacaEntrChange = (event) => {
        const checked = event.target.checked;
        const nuevas = [...temporadas];
        const temporada = { ...nuevas[temporadaActual] };
        const entradas = [...temporada.entradas];
        entradas[entradaActual] = {
            ...entradas[entradaActual],
            seleccionButaca: checked,
            layoutButacas: checked ? entradas[entradaActual].layoutButacas : null,
        };
        temporada.entradas = entradas;
        nuevas[temporadaActual] = temporada;

        setTemporadas(nuevas);
    }

    const handleLayoutEntrChange = (event) => {
        const file = event.target.files?.[0] ?? null;
        
        if (!file) return;
        
        const nuevas = [...temporadas];
        const temporada = { ...nuevas[temporadaActual] };
        const entradas = [...temporada.entradas];
        entradas[entradaActual] = {
            ...entradas[entradaActual],
            layoutButacas: file,
        };
        temporada.entradas = entradas;
        nuevas[temporadaActual] = temporada;

        setTemporadas(nuevas);
    }

    const addEntrada = () => {
        // COPIA DE TEMPORADA
        const modTemporada = [...temporadas];
        // TEMPORADA ACTUAL
        const actTemporada = modTemporada[temporadaActual];
        // Modificación de las entradas
        const nuevasEntradas = [...actTemporada.entradas,
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
        ];
        modTemporada[temporadaActual] = {
            ...actTemporada,
            entradas: nuevasEntradas,
        };
        setTemporadas(modTemporada);
        console.log("Nuevas entradas: ", nuevasEntradas);
    }
    function removeEntrada(tid) {
        setTemporadas((prev) => prev.filter((t) => t.id !== tid));
    }

    // Agrega una nueva función y navega a ella
    const agregarFuncion = () => {
        setFunciones([...funciones, { inicio: "", fin: "" }]);
        setFuncionActual(funciones.length); // Navega a la nueva función
    };

    // Elimina la función actual
    // const eliminarFuncion = () => {
    //     if (funciones.length === 1) return; // No eliminar si solo hay una
    //     const nuevasFunciones = funciones.filter((_, i) => i !== funcionActual);
    //     setFunciones(nuevasFunciones);
    //     setFuncionActual((prev) => {
    //         if (prev >= nuevasFunciones.length) return nuevasFunciones.length - 1;
    //         return prev;
    //     });
    // };

    // Navegación circular
    const irTemporadaIzq = () => {
        setTemporadaActual((prev) => (prev === 0 ? temporadas.length - 1 : prev - 1));
    };
    const irTemporadaDer = () => {
        setTemporadaActual((prev) => (prev === temporadas.length - 1 ? 0 : prev + 1));
    };
    // Navegación circular
    const irEntradaIzq = () => {
        setEntradaActual((prev) => (prev === 0 ? temporadas[temporadaActual].entradas.length - 1 : prev - 1));
    };
    const irEntradaDer = () => {
        setEntradaActual((prev) => (prev === temporadas[temporadaActual].entradas.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="crear-ticket-container">
            {/* Encabezado */}
            <div className="header">
                <span className="step">3</span>
                <h2>Crear Entradas</h2>
            </div>
            <div className="campo">
                <label htmlFor="moneda">Moneda</label>
                <select id="categoria">
                    <option>Elige un tipo de moneda</option>
                    <option value="pen">S (PEN)</option>
                    <option value="dol">$ (USD)</option>
                    <option value="eur">€ (EUR)</option>
                </select>
            </div>
            {/* Temporadas */}
            <div className="funciones-section">
                {/* Cabecera  */}
                <div className="funciones-header">
                    <button className="btn p-0 me-2 text-success fw-semibold" onClick={addTemporada}>
                        + Agregar temporada
                    </button>
                    <button className="btn p-0 me-2 text-danger fw-semibold" onClick={removeTemporada}>
                        Eliminar
                    </button>
                    <button className="season-tab__arrow" onClick={irTemporadaIzq}>
                        &#60;
                    </button>
                    <span className="fw-bold text-success">Temporada {temporadaActual + 1} de {temporadas.length}</span>
                    <button className="season-tab__arrow" onClick={irTemporadaDer}>
                        &#62;
                    </button>
                </div>
                {/* Cuerpo */}
                <div className="row g-3 rounded-3 p-3" style={{ background: "#eaf7ef" }}>
                    <div className="col-12 col-md-4">
                        <label>Nombre de la temporada</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Escribe la temporada"
                            value={temporadas[temporadaActual].nombre}
                            onChange={handleNameTempChange}
                        />
                    </div>
                    <div className="col-12 col-md-2">
                        <label>Descuento</label>
                        <input
                            type="number"
                            className="form-control"
                            value={temporadas[temporadaActual].descuento}
                            onChange={handleDescTempChange}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <label>Fecha de Inicio</label>
                        <input
                            type="date"
                            className="form-control"
                            value={temporadas[temporadaActual].fechaInicio || ""}
                            onChange={handleFIniTempChange}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <label>Fecha de Fin</label>
                        <input
                            type="date"
                            className="form-control"
                            value={temporadas[temporadaActual].fechaFin || ""}
                            onChange={handleFFinTempChange}
                        />
                    </div>
                </div>
            </div>
            {/* Entradas */}
            <div className="funciones-section">
                <div className="funciones-header">
                    <button className="btn p-0 me-2 text-success fw-semibold" onClick={addEntrada}>
                        + Agregar entrada
                    </button>
                    <button className="btn p-0 me-2 text-danger fw-semibold" onClick={removeEntrada}>
                        Eliminar
                    </button>
                    <button className="season-tab__arrow" onClick={irEntradaIzq}>
                        &#60;
                    </button>
                    <span className="fw-bold text-success">Entada {entradaActual + 1} de {temporadas[temporadaActual].entradas.length}</span>
                    <button className="season-tab__arrow" onClick={irEntradaDer}>
                        &#62;
                    </button>
                </div>
                <div className="row g-3 rounded-3 p-3" style={{ background: "#eaf7ef" }}>
                    <div className="col-12 col-md-4">
                        <label>Tipo de la entrada</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="VIP, Preferencial, Estándar"
                            value={temporadas[temporadaActual].entradas[entradaActual].tipo}
                            onChange={handleTipoEntrChange}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <label>Zona de la entrada</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Zona del estadio"
                            value={temporadas[temporadaActual].entradas[entradaActual].zona}
                            onChange={handleZonaEntrChange}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <label>Descuento</label>
                        <input
                            type="number"
                            className="form-control"
                            value={temporadas[temporadaActual].entradas[entradaActual].descuento}
                            onChange={handleDescuentoEntrChange}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <label>Max. cantidad por orden</label>
                        <input
                            type="number"
                            className="form-control"
                            value={temporadas[temporadaActual].entradas[entradaActual].maxPorOrden}
                            onChange={handleMaxEntrChange}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <label>Cantidad disponible</label>
                        <input
                            type="number"
                            className="form-control"
                            value={temporadas[temporadaActual].entradas[entradaActual].cantidadDisponible}
                            onChange={handleCantEntrChange}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <label className="form-label">Descripción</label>
                        <input
                            type=""
                            rows="4"
                            className="form-control"
                            placeholder="Escribe información adicional sobre el tipo de entrada."
                            value={temporadas[temporadaActual].entradas[entradaActual].descripcion}
                            onChange={handleDescripcionEntrChange}
                        />
                    </div>
                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="permiteButaca"
                            checked={temporadas[temporadaActual].entradas[entradaActual].seleccionButaca}
                            onChange={handleButacaEntrChange}
                        />
                        <label className="form-check-label" htmlFor="permiteButaca">
                            Permite seleccionar butaca
                        </label>
                    </div>
                    {/* <label className="form-label mb-1">
                        Adjunte la distribución de las butacas para la entrada
                    </label> */}
                    <input
                        type="file"
                        className="form-control"
                        disabled={!temporadas[temporadaActual].entradas[entradaActual].seleccionButaca}
                        onChange={handleLayoutEntrChange}
                    />
                </div>
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
                <button
                    type="button"
                    className="cancel"
                    onClick={() => navigate("/home")}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    className="next"
                    onClick={() => navigate("/ubicacion-evento")}
                >
                    Siguiente
                </button>
            </div>
        </div>
    )
}

