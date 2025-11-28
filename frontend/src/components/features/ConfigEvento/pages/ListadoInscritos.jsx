import React from "react";
import { useParams } from "react-router-dom";
import { getInscritosByEvento } from "../../../../globalServices/EventoService";


export const ListadoInscritos = () => {
    const { idEvento } = useParams();

    const [inscritos, setInscritos] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        getInscritosByEvento(idEvento)
            .then((data) => {
                console.log("INSCRITOS:", data);
                setInscritos(data);
            })
            .catch((err) => {
                console.error("Error cargando inscritos", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [idEvento]);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Listado de Inscritos</h1>
            <p>ID del evento: {idEvento}</p>

            <div
                style={{
                    marginTop: "20px",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                }}
            >
                <h2>Asistentes</h2>

                {loading ? (
                    <p style={{ color: "#666" }}>Cargando asistentes…</p>
                ) : inscritos.length === 0 ? (
                    <p>No hay inscritos para este evento.</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                        <thead>
                            <tr style={{ background: "#f3f3f3" }}>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Nombre</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tipo Entrada</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Zona</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fecha Compra</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Fecha Función</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inscritos.map((item) => (
                                <tr key={item.idTicket}>
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                        {item.cliente?.nombre || "Sin nombre"}
                                    </td>
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                        {item.detalleCompra?.tipoEntrada?.nombre}
                                    </td>
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                        {item.detalleCompra?.zona?.nombre}
                                    </td>
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                        {item.detalleCompra?.ordenCompra?.fechaCompra?.substring(0, 10)}
                                    </td>
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                        {item.detalleCompra?.ordenCompra?.funcion?.fechaInicio}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}
            </div>
        </div>
    );
};
