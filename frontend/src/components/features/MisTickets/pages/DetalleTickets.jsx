import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetalleTickets.css"; // ← renombrado
import { useAuth } from "../../../../context/AuthContext";
import { getTicketsByEvent } from "../service/MisTicketsService";
import { abrirTickets } from "../../../../globalServices/PDFService";

export default function DetalleTickets() {
    const { idEvento } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                if (!user?.idUsuario) return;
                const data = await getTicketsByEvent(user.idUsuario, idEvento);
                setTickets(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setError("No se pudo cargar la información de la compra.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user?.idUsuario, idEvento]);

    const vm = useMemo(() => {
        if (tickets.length === 0) return null;
        const tk0 = tickets[0];
        const oc = tk0?.detalleCompra?.ordenCompra;
        const fn = oc?.funcion;
        const ev = fn?.evento;

        const fechaISO = String(fn?.fechaInicio || "").slice(0, 10);
        const horaISO = String(fn?.fechaInicio || "").slice(11, 16);

        const agrup = {};
        tickets.forEach((t) => {
            const det = t?.detalleCompra;
            const zona = det?.zona?.nombre || det?.zonaNombre || "Zona";
            const tipo = det?.tipoEntrada?.nombre || det?.tipoNombre || "Entrada";
            const key = `${zona}|${tipo}`;
            if (!agrup[key]) agrup[key] = { zona, tipo, cantidad: 0, subtotal: 0 };
            agrup[key].cantidad += 1;
            const precio = Number(det?.precioUnitario ?? t?.precio ?? 0);
            agrup[key].subtotal += precio;
        });
        const itemsCompra = Object.values(agrup);
        const total = itemsCompra.reduce((acc, it) => acc + it.subtotal, 0);

        return {
            evento: {
                id: ev?.idEvento,
                nombre: ev?.nombre,
                direccion: ev?.direccion,
                imagen: ev?.urlImagen,
            },
            funcion: { fecha: fechaISO, hora: horaISO },
            orden: {
                id: oc?.idOrdenCompra,
                nroTransaccion: oc?.idOrdenCompra ?? "—",
                fechaCompra: String(oc?.fechaCompra || "").slice(0, 10),
                horaCompra: String(oc?.fechaCompra || "").slice(11, 16),
                metodoPago: oc?.metodoPago || oc?.metodo || "—",
            },
            cliente: {
                nombre: `${user?.nombre || ""} ${user?.apellido || ""}`.trim(),
                documento: user?.dni ?? user?.DNI ?? user?.ruc ?? "—",
                tokenText:
                    tk0?.cliente?.tokenText ??
                    (user?.rol === "ORGANIZADOR" ? "RUC" : "DNI"),
                tipoDocumento:
                    tk0?.cliente?.tipoDocumento ??
                    (user?.rol === "ORGANIZADOR" ? "RUC" : "DNI"),
            },
            itemsCompra,
            total,
            tickets,
        };
    }, [tickets, user]);

    const goBack = () => navigate("/MisTickets");

    const verMisQR = async () => {
        const ids = vm?.tickets?.map(t => t.idTicket) ?? [];

        if (ids.length === 0) {
            alert("No hay tickets para procesar.");
            return;
        }

        try {
            await abrirTickets(ids);
        } catch (e) {
            alert("Error al abrir tickets:", e);
        }
    };

    if (loading) {
        return (
            <div className="ticket-detail-wrapper">
                <div className="ticket-detail-card">Cargando…</div>
            </div>
        );
    }
    if (error || !vm) {
        return (
            <div className="ticket-detail-wrapper">
                <div className="ticket-detail-card text-danger">{error || "Sin información"}</div>
            </div>
        );
    }

    return (
        <div className="ticket-detail-wrapper">
            <div className="ticket-detail-card">
                <div className="td-header">
                    <img src={vm.evento.imagen || "/placeholder_event.png"} alt={vm.evento.nombre} className="td-cover" />
                    <div className="td-header-info">
                        <div className="td-title">{vm.evento.nombre}</div>
                        <div className="td-subtitle">
                            <div>Fecha y hora del evento:</div>
                            <div>
                                {vm.funcion.fecha
                                    ? new Date(vm.funcion.fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" })
                                    : "—"}{" "}
                                {vm.funcion.hora ? `${vm.funcion.hora}` : ""}
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-success btn-sm td-qr" onClick={verMisQR}>Ver mis QR</button>
                </div>

                <hr className="my-2" />

                <Section title="Detalle Transacción">
                    <TwoCol
                        leftLabel="Fecha de Compra"
                        leftValue={vm.orden.fechaCompra ? new Date(vm.orden.fechaCompra).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
                        rightLabel="Hora de compra"
                        rightValue={vm.orden.horaCompra || "—"}
                    />
                    <TwoCol leftLabel="Token" leftValue="—" rightLabel="N° de Transacción" rightValue={vm.orden.nroTransaccion} />
                </Section>

                <Section title="Cliente">
                    <TwoCol leftLabel="Nombre" leftValue={vm.cliente.nombre || "—"} rightLabel="Hora de compra" rightValue={vm.orden.horaCompra || "—"} />
                    <TwoCol
                        leftLabel="Token"
                        leftValue={vm.cliente.tokenText || "DNI"}
                        rightLabel={`N° de ${vm.cliente.tipoDocumento || "Documento"}`}
                        rightValue={vm.cliente.documento}
                    />
                </Section>

                <Section title="Datos de la compra">
                    <div className="td-items">
                        {vm.itemsCompra.map((it, idx) => (
                            <div className="td-item-row" key={idx}>
                                <div className="td-item-name">x{it.cantidad} {it.tipo} ({it.zona})</div>
                                <div className="td-item-price">S/. {it.subtotal.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* <Section title="Datos del Pago">
                    <div className="td-pay-method">
                        <div>Método de pago</div>
                        <div className="fw-semibold">{vm.orden.metodoPago}</div>
                    </div>
                </Section> */}

                <div className="td-total">
                    <div>TOTAL</div>
                    <div className="td-total-amount">S/. {vm.total.toFixed(2)}</div>
                </div>

                <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-warning">
                        Solicitar devolución
                    </button>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-dark" onClick={goBack}>
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
}
const Section = ({ title, children }) => (
    <div className="td-section">
        <div className="td-section-header">
            <span className="td-section-title">{title}</span>
            <span className="td-caret">▾</span>
        </div>
        <div className="td-section-body">{children}</div>
    </div>
);

const TwoCol = ({ leftLabel, leftValue, rightLabel, rightValue }) => (
    <div className="row g-2 td-two-col">
        <div className="col-12 col-md-6">
            <div className="td-label">{leftLabel}</div>
            <div className="td-value">{leftValue}</div>
        </div>
        <div className="col-12 col-md-6">
            <div className="td-label">{rightLabel}</div>
            <div className="td-value">{rightValue}</div>
        </div>
    </div>
);
