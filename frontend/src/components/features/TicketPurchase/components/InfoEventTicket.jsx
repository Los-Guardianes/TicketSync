import "./InfoEventTicket.css"

export const InfoEventTicket = ({evento, totalBruto, montoDescuentoPeriodo, montoDescuentoCodigo, periodo, descuentoCodigo,total}) => {

    const getTipoDescuentoCodigoLabel = () => {
        if (!descuentoCodigo) return "";
        if (descuentoCodigo.tipoDesc === "PORCENTAJE") {
        return `(${descuentoCodigo.valorDescuento}%)`;
        }
        if (descuentoCodigo.tipoDesc === "MONTO") {
        return "(Monto)";
        }
        return "";
    };

        const getTipoDescuentoPeriodoLabel = () => {
        console.log("Descuento periodo: ",periodo)
        if (!periodo) return "";
        if (periodo.tipoDesc === "PORCENTAJE") {
        return `(${periodo.valorDescuento}%)`;
        }
        if (periodo.tipoDesc === "MONTO") {
        return "(Monto)";
        }
        return "";
    };

    return (
        <>
            <h2>{evento?.nombre || 'Cargando...'}</h2>
            <img className="info-event-image" src= { evento ? evento.urlImagen : "/tuticket_logo.png"}/>
            <span>
                <p>{evento?.descripcion || 'Cargando...'}</p>
                <p>{evento?.direccion || 'Cargando...'}</p>
            </span>
            <ul className="info-event">                
                <li>
                    <h3>Total Bruto</h3>
                    <p>S/ {totalBruto || 0}</p>
                    <h3 >Descuento Periodo {getTipoDescuentoPeriodoLabel()}</h3>
                    <p className="discount">S/ {montoDescuentoPeriodo || 0}</p>
                    <h3>
                        Descuento Aplicado {getTipoDescuentoCodigoLabel()}
                    </h3>
                    <p className="discount">S/ {montoDescuentoCodigo || 0}</p>
                    <h3>Total</h3>
                    <p>S/ {total || 0}</p>
                </li>
            </ul>
        </>
    )
}