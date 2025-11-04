import "./InfoEventTicket.css"

export const InfoEventTicket = ({evento, totalBruto, montoDescuentoPeriodo, montoDescuentoCodigo, total}) => {
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
                    <h3 >Descuento Periodo</h3>
                    <p className="discount">S/ {montoDescuentoPeriodo || 0}</p>
                    <h3 >Descuento Aplicad</h3>
                    <p className="discount">S/ {montoDescuentoCodigo || 0}</p>
                    <h3>Total</h3>
                    <p>S/ {total || 0}</p>
                </li>
            </ul>
        </>
    )
}