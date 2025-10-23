import "./InfoEventTicket.css"

export const InfoEventTicket = ({evento, totalDetalle, montoDescuento, montoComision, montoFinal}) => {
    return (
        <>
            <h2>{evento?.nombre || 'Cargando...'}</h2>
            <img src="/tuticket_logo.png"/>
            <ul className="info-event">
                <li>
                    <h3>Total detalles:</h3>
                    <p>S/ {totalDetalle}</p>
                    
                </li>
                <li>
                    <h3>Descuento:</h3>
                    <p>S/ {montoDescuento}</p>
                    
                </li>
                <li>
                    <h3>Comisión:</h3>
                    <p>S/ {montoComision}</p>                        
                </li>
                <li>
                    <h3>Monto Final</h3>
                    <p>S/ {montoFinal}</p>                        
                </li>
            </ul>
        </>
    )
}