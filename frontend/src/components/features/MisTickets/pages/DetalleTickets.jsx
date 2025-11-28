
import { useParams, useNavigate } from "react-router-dom";
import "./DetalleTickets.css"; // ← renombrado
import { useAuth } from "../../../../context/AuthContext";
import { abrirTickets } from "../../../../globalServices/PDFService";
import { useDetalleTickets } from "../service/useDetalleTickets";
import { DropdownList } from "../../../common/DropDownList/DropDownList";

export default function DetalleTickets() {
    const { idEvento } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { ordenCompra, 
        evento,
        funciones,
        cliente, 
        selectedFuncion, 
        obtenerTickets, 
        seleccionarFuncion,
        obtenerNombre
    } = useDetalleTickets(idEvento, user?.idUsuario);

    const getNombre = (funcion) => {
        if(!funcion)return;
        const date = new Date(`${funcion.fechaInicio}T${funcion.horaInicio}`);
        return new Intl.DateTimeFormat("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
    }

    const goBack = () => navigate("/MisTickets");

    const verMisQR = async () => {
        const tickets = await obtenerTickets(idEvento, user?.idUsuario);
        const ids = tickets.map(t => t.idTicket) ?? [];

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

    return (
        <>
        <div className="ticket-detail-wrapper">
            <div className="ticket-detail-card">
                <div className="td-header">               
                    <div className="td-header-details">
                        {/* CORRECCIÓN 1: evento?.urlImagen */}
                        <img 
                            src={evento?.urlImagen || "/placeholder_event.png"} 
                            alt={evento?.nombre || "Evento"} 
                            className="td-cover" 
                        />
                        <div>
                            {/* CORRECCIÓN 2: evento?.nombre */}
                            <div className="td-title">{evento?.nombre || "Cargando..."}</div>
                        </div>                            
                    </div>
                    <DropdownList 
                        list={funciones}
                        value={selectedFuncion ? selectedFuncion.idFuncion : ""}
                        id={"idFuncion"}
                        onChangeOption={seleccionarFuncion}
                        getNombre={getNombre}
                    />
                    <button 
                        className="btn btn-success" 
                        onClick={verMisQR}
                        disabled={!ordenCompra} // Deshabilitar si no hay compra
                    > 
                        Ver mis QR
                    </button>
                </div>
                {ordenCompra ? (
                    <>
                        <hr className="my-2" />
                        <Section title="Detalle Transacción">
                            <TwoCol
                                leftLabel="Fecha de Compra"
                                leftValue={ordenCompra?.fechaOrden ? String(ordenCompra.fechaOrden).slice(0,10) : "—"}
                                rightLabel="Hora de compra"
                                rightValue={ordenCompra?.fechaOrden ? String(ordenCompra.fechaOrden).slice(11,16) : "—"}
                            />
                            <TwoCol 
                                leftLabel="Método de Pago" 
                                leftValue={ordenCompra?.metodoPago || "—"} 
                                rightLabel="N° de Transacción" 
                                rightValue={ordenCompra?.idOrdenCompra} 
                            />
                        </Section>        
                        <Section title="Cliente">
                            {/* CORRECCIÓN 3: cliente?.nombre */}
                            <TwoCol 
                                leftLabel="Nombres" 
                                leftValue={cliente?.nombre || "—"} 
                                rightLabel="Apellidos" 
                                rightValue={cliente?.apellido || "—"} 
                            />
                            <TwoCol
                                leftLabel="Telefono"
                                leftValue={cliente?.telefono || "—"}
                                rightLabel={`N° de DNI`}
                                rightValue={cliente?.dni || "-"}
                            />
                        </Section>
                        <Section title="Datos de la compra">
                            <div className="td-items">
                                {/* CORRECCIÓN 4: Lógica del map y operador && */}
                                {ordenCompra.detallesCompras?.map((it, idx) => (
                                    it.cantidad > 0 && (
                                        <div className="td-item-row" key={idx}>
                                            <div className="td-item-name">x{`${it.cantidad} ${obtenerNombre(it.idTarifa, it.idPeriodo)}`}</div>
                                            {/* CORRECCIÓN 5: Safe access a precioDetalle */}
                                            <div className="td-item-price">S/. {it.precioDetalle?.toFixed(2) || "0.00"}</div>                            
                                        </div>
                                    )
                                ))}
                            </div>
                        </Section>
                        <div className="td-total">
                            <div>Subtotal</div>
                            {/* CORRECCIÓN 6: Safe access a totalBruto */}
                            <div className="td-total-amount">S/. {ordenCompra.totalBruto?.toFixed(2) || "0.00"}</div>
                        </div>

                        {/* 2. Descuento (Solo se muestra si es mayor a 0) */}
                        {ordenCompra.descuentoAplicado > 0 && (
                            <div className="td-summary-row td-discount">
                                <span>Descuento aplicado</span>
                                <span>- S/. {ordenCompra.descuentoAplicado?.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="td-total">
                            <div>TOTAL</div>
                            <div className="td-total-amount">S/. {ordenCompra.total?.toFixed(2) || "0.00"}</div>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <button className="btn btn-dark" onClick={goBack}>
                                Volver
                            </button>
                        </div>
                    </>
                ): (
                    /* CASO: NO HAY COMPRA (NULL) */
                    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
                        {/* Puedes usar un icono si tienes bootstrap icons */}
                        <div style={{ fontSize: '3rem', opacity: 0.5 }}>🎫</div> 
                        <h5 className="mt-3">Sin registros</h5>
                        <p className="text-center mb-0">
                            No tienes compras registradas para la función seleccionada.<br/>
                            Intenta seleccionar otra fecha u horario.
                        </p>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}


const Section = ({ title, children }) => (
    <div className="td-section">
        <div className="td-section-header">
            <span className="td-section-title">{title}</span>
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