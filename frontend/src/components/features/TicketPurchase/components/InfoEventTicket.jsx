import "./InfoEventTicket.css"

export const InfoEventTicket = ({evento}) => {
    return (      
        <article>
            <h2>{evento?.nombre || 'Cargando...'}</h2>
            <img className="info-event-image" src= { evento ? evento.urlImagen : "/tuticket_logo.png"}/>
            <span>
                <p>{evento?.descripcion || 'Cargando...'}</p>
                <p>{evento?.direccion || 'Cargando...'}</p>
            </span>            
        </article>           
    )
}