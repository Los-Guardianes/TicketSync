import "./InfoEventTicket.css"

export const InfoEventTicket = ({evento}) => {
    return (      
        <article>
            <h2 className="info-event-title">{evento?.nombre || 'Cargando...'}</h2>
            <div className="info-event">
                <img className="info-event-image" src= { evento ? evento.urlImagen : "/tuticket_logo.png"}/>
                <span>
                    <p>{evento?.descripcion || 'Cargando...'}</p>
                    <h3>{evento?.direccion || 'Cargando...'}</h3>
                </span>
            </div>         
        </article>           
    )
}