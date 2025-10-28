import "./InfoEventTicket.css"

export const InfoEventTicket = ({evento, montoFinal}) => {
    return (
        <>
            <h2>{evento?.nombre || 'Cargando...'}</h2>
            <img src="/tuticket_logo.png"/>
            <span>
                <p>{evento?.descripcion || 'Cargando...'}</p>
                <p>{evento?.direccion || 'Cargando...'}</p>
            </span>
            <ul className="info-event">                
                <li>
                    <h3>Monto Final</h3>
                    <p>S/ {montoFinal}</p>                        
                </li>
            </ul>
        </>
    )
}