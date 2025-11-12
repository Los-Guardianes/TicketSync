export const PurchaseTicket = ({ totalBruto, montoDescuentoPeriodo, montoDescuentoCodigo, periodo, descuentoCodigo,total}) => {    

    const getTipoDescuentoByLabel = (descuento) => {
        if (!descuento) return "";
        if (descuento.tipoDesc === "PORCENTAJE") {
        return `(${descuento.valorDescuento}%)`;
        }
        if (descuento.tipoDesc === "MONTO") {
        return "(Monto)";
        }
        return "";
    };

    return (
        <>        
        <article>                                                                                    
            <ul className="info-event">                
                <li>
                    <h3>Total Bruto</h3>
                    <p>S/ {totalBruto || 0}</p>
                    <h3 >Descuento Periodo {getTipoDescuentoByLabel(periodo)}</h3>
                    <p className="discount">S/ {montoDescuentoPeriodo || 0}</p>
                    <h3>
                        Descuento Aplicado {getTipoDescuentoByLabel(descuentoCodigo)}
                    </h3>
                    <p className="discount">S/ {montoDescuentoCodigo || 0}</p>
                    <h3>Total</h3>
                    <p>S/ {total || 0}</p>
                </li>
            </ul> 
        </article>
        </>
    )
}