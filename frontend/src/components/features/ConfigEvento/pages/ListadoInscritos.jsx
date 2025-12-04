import React from "react";
import { useParams } from "react-router-dom";
import { getInscritosByEvento } from "../../../../globalServices/EventoService";
import { apiDownload } from "../../../../globalServices/API";
import "./ListadoInscritos.css";

export const ListadoInscritos = () => {
    const { idEvento } = useParams();

    const [inscritos, setInscritos] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const [zonaFilter, setZonaFilter] = React.useState("TODOS");
    const [funcionFilter, setFuncionFilter] = React.useState("TODOS");

    // PAGINACIÓN
    const [currentPage, setCurrentPage] = React.useState(0);
    const pageSize = 10; // puedes cambiarlo a 20, etc.

    React.useEffect(() => {
        setLoading(true);
        getInscritosByEvento(idEvento)
            .then((data) => {
                setInscritos(data);
                setCurrentPage(0); // Reset paginación al cambiar evento
            })
            .catch((err) => console.error("Error cargando inscritos", err))
            .finally(() => setLoading(false));
    }, [idEvento]);

    const zonas = React.useMemo(() => {
        const s = new Set();
        inscritos.forEach((i) => {
            const z = i.detalleCompra?.zona?.nombre;
            if (z) s.add(z);
        });
        return [...s];
    }, [inscritos]);

    const funciones = React.useMemo(() => {
        const s = new Set();
        inscritos.forEach((i) => {
            const f = i.detalleCompra?.ordenCompra?.funcion?.fechaInicio;
            if (f) s.add(f);
        });
        return [...s];
    }, [inscritos]);

    const inscritosFiltrados = inscritos.filter((i) => {
        const zonaOK =
            zonaFilter === "TODOS" ||
            i.detalleCompra?.zona?.nombre === zonaFilter;

        const funcionOK =
            funcionFilter === "TODOS" ||
            i.detalleCompra?.ordenCompra?.funcion?.fechaInicio === funcionFilter;

        return zonaOK && funcionOK;
    });

    // --- Paginación ---
    const totalPages = Math.ceil(inscritosFiltrados.length / pageSize);

    const start = currentPage * pageSize;
    const end = start + pageSize;
    const inscritosPaginados = inscritosFiltrados.slice(start, end);

    const goToPage = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentpage(page);
        }
    };

    const handleExportExcel = async () => {
        try {
            setLoading(true);

            const blob = await apiDownload(`/api/evento/${idEvento}/inscritos/reporte/excel`);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `inscritos_evento_${idEvento}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar la lista de participantes: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inscritos-container">
            <h2 className="inscritos-title">Asistentes</h2>

            <div className="filtros-container">
                <div className="filtro">
                    <label>Filtrar por Zona:</label>
                    <select
                        value={zonaFilter}
                        onChange={(e) => { setZonaFilter(e.target.value); setCurrentPage(0); }}
                    >
                        <option value="TODOS">Todos</option>
                        {zonas.map((z, i) => (
                            <option key={i} value={z}>{z}</option>
                        ))}
                    </select>
                </div>

                <div className="filtro">
                    <label>Filtrar por Función:</label>
                    <select
                        value={funcionFilter}
                        onChange={(e) => { setFuncionFilter(e.target.value); setCurrentPage(0); }}
                    >
                        <option value="TODOS">Todas</option>
                        {funciones.map((f, i) => (
                            <option key={i} value={f}>{f}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Botón de exportar */}
            <div className="export-section">
                <button
                    className="btn-export"
                    onClick={handleExportExcel}
                    disabled={loading}
                >
                    <i className="bi bi-file-earmark-excel"></i>
                    {loading ? ' Generando...' : ' Exportar Lista de Participantes'}
                </button>
            </div>

            {loading ? (
                <p className="mensaje-cargando">Cargando asistentes…</p>
            ) : inscritosFiltrados.length === 0 ? (
                <p className="mensaje-vacio">No hay inscritos con los filtros actuales.</p>
            ) : (
                <>
                    <div className="tabla-wrapper">
                        <table className="tabla-inscritos">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo Entrada</th>
                                    <th>Zona</th>
                                    <th>Fecha Compra</th>
                                    <th>Fecha Función</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inscritosPaginados.map((item, index) => (
                                    <tr key={item.idTicket} className="fila">
                                        <td>{item.cliente?.nombre || "Sin nombre"}</td>
                                        <td>{item.detalleCompra?.tipoEntrada?.nombre}</td>
                                        <td>{item.detalleCompra?.zona?.nombre}</td>
                                        <td>{item.detalleCompra?.ordenCompra?.fechaCompra?.substring(0, 10)}</td>
                                        <td>{item.detalleCompra?.ordenCompra?.funcion?.fechaInicio}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ==== PAGINACIÓN ==== */}
                    <div className="paginacion">
                        <button
                            className="page-btn"
                            disabled={currentPage === 0}
                            onClick={() => goToPage(currentPage - 1)}
                        >
                            ← Anterior
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i)}
                                className={`page-number ${i === currentPage ? "active" : ""}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            disabled={currentPage === totalPages - 1}
                            onClick={() => goToPage(currentPage + 1)}
                        >
                            Siguiente →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
