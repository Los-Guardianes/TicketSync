"use client"
import React from "react"
import "./OrganizerEventCard.css"
import { useNavigate } from "react-router-dom"

export const OrganizerEventCard = ({
  idEvento,
  titulo,
  fecha,
  direccion,
  imagen,
  actionLabel = "Configurar",
  esPasado = false,
}) => {
  const navigate = useNavigate()

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  const handleClick = () => {
    if (actionLabel.toLowerCase().includes("config")) {
      navigate(`/organizer/evento/${idEvento}/config`)
    } else {
      console.log("Ver detalle", idEvento)
    }
  }

  return (
    <div className={`organizer-event-card ${esPasado ? "organizer-event-card--past" : ""}`}>
      <div className="organizer-event-card__image-container">
        <img 
            src={imagen || "/placeholder_event.png"} 
            alt={titulo} 
            className="organizer-event-card__image" 
        />
        <div className="organizer-event-card__gradient-overlay"></div>
        {esPasado && <div className="organizer-event-card__past-badge">Finalizado</div>}
      </div>

      <div className="organizer-event-card__content">
        <div className="organizer-event-card__header">
          <div className="organizer-event-card__title-section">
            <h3 className="organizer-event-card__title">{titulo}</h3>
          </div>
        </div>

        <div className="organizer-event-card__details">
          {fecha && <div className="organizer-event-card__date">{formatDate(fecha)}</div>}
          {direccion && <div className="organizer-event-card__location">{direccion}</div>}
        </div>

        <div className="organizer-event-card__footer">
          <button className="ticket-card__button btn-primary" onClick={handleClick}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}