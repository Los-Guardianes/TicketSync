"use client"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../../context/AuthContext"
import "./Card.css"

export const Card = ({ id, titulo, fecha, ubicacion, ulrimagen }) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const start_purchase = () => {
    const target = `/ticket-purchase/${id}`
    /* Prueba del ProtecRoute
    if (!isAuthenticated) navigate("/login", { state: { from: target } })
    else{
    } 
    */
    navigate(target)
  }

  return (
    <div className="event-card">
      <div className="event-card-image-container">
        <img className="event-card-image" src={ulrimagen || "/placeholder.png"} alt={titulo} />
      </div>

      <div className="event-card-body">
        <p className="event-card-location">{ubicacion}</p>
        <h3 className="event-card-title">{titulo}</h3>
        <p className="event-card-date">{fecha}</p>
        <button className="event-card-button" onClick={start_purchase}>
          Ver más
        </button>
      </div>
    </div>
  )
}
