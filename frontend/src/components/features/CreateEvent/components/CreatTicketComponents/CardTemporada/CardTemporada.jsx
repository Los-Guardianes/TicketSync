"use client"
import { Edit3, Trash2 } from "lucide-react"
import "./CardTemporada.css"

export const CardTemporada = ({ temporada, isSelected, onSeleccionar, onModificar, onEliminar }) => {
  const formatFecha = (fecha) => {
    if (!fecha) return "No definida"
    
    // Agregar un día para compensar el offset
    const fechaAjustada = new Date(fecha)
    fechaAjustada.setDate(fechaAjustada.getDate() + 1)
    
    return fechaAjustada.toLocaleDateString("es-ES")
    }

  const getTipoDescuentoText = (tipo) => {
    return tipo === "PORCENTAJE" ? "Porcentaje" : "Monto Fijo"
  }

  return (
    <div className={`card-temporada ${isSelected ? "selected" : ""}`} onClick={onSeleccionar}>
      <div className="card-temporada-content">
        <div className="temporada-main">
          <span className="temporada-badge">{temporada.nombre}</span>
        </div>

        <div className="temporada-info-row">
          <div className="info-badge">
            <span>{getTipoDescuentoText(temporada.tipoDesc)}</span>
            <span className="info-value">
              {temporada.tipoDesc === "PORCENTAJE" ? `${temporada.valorDescuento}%` : `S/${temporada.valorDescuento}`}
            </span>
          </div>
          <div className="info-badge info-dates">
            <span className="date-label">{formatFecha(temporada.fechaInicio)}</span>
            <span className="date-separator">-</span>
            <span className="date-label">{formatFecha(temporada.fechaFin)}</span>
          </div>
        </div>
      </div>

      <div className="card-temporada-actions">
        <button
          className="btn-action btn-modificar"
          onClick={(e) => {
            e.stopPropagation()
            onModificar()
          }}
          title="Modificar temporada"
        >
          <Edit3 style={{ width: 24, height: 24 }}/>
        </button>
        <button
          className="btn-action btn-eliminar"
          onClick={(e) => {
            e.stopPropagation()
            onEliminar()
          }}
          title="Eliminar temporada"
        >
          <Trash2 style={{ width: 24, height: 24 }}/>
        </button>
      </div>
    </div>
  )
}
