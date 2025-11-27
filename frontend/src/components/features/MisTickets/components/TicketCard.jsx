"use client"
import "./TicketCard.css"

const TicketCard = ({ imagen, titulo, fecha, direccion, ticketsCount, onDetail, esPasado = false }) => {
  return (
    <div className={`ticket-card ${esPasado ? 'ticket-card--past' : ''}`}>
      <div className="ticket-card__image-container">
        <img src={imagen || "/placeholder_event.png"} alt={titulo} className="ticket-card__image" />
        <div className="ticket-card__gradient-overlay"></div>
        {esPasado && <div className="ticket-card__past-badge">Finalizado</div>}
      </div>

      <div className="ticket-card__content">
        <div className="ticket-card__header">
          <div className="ticket-card__title-section">
            <h3 className="ticket-card__title">{titulo}</h3>
            {ticketsCount > 0 && (
              <span className="ticket-card__badge">x{ticketsCount}</span>
            )}
          </div>
        </div>

        <div className="ticket-card__details">
          {fecha && (
            <div className="ticket-card__date">
              {fecha.toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          )}

          {direccion && (
            <div className="ticket-card__location">
              {direccion}
            </div>
          )}
        </div>

        <button className="ticket-card__button btn-primary" onClick={onDetail}>
          Ver Detalle
        </button>
      </div>
    </div>
  )
}

export default TicketCard