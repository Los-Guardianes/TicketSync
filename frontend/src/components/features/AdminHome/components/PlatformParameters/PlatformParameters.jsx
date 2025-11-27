"use client"

import { useState } from "react"
import "./PlatformParameters.css"

export const PlatformParameters = ({ onSave }) => {
  const [params, setParams] = useState({
    commissionPerTicket: "",
    maxTicketsPerPurchase: "",
    refundPeriodDays: "",
    cancellationPeriodDays: "",
  })

  const handleChange = (field, value) => {
    setParams({ ...params, [field]: value })
  }

  const handleSave = () => {
    onSave(params)
  }

  return (
    <div className="platform-parameters">
      <div className="platform-parameters-header">
        <div className="platform-parameters-icon">
          <i className="bi bi-gear-fill"></i>
        </div>
        <h3 className="platform-parameters-title">Parámetros de la plataforma</h3>
      </div>
      <p className="platform-parameters-description">Configura los ajustes principales del sistema.</p>

      <div className="platform-parameters-form">
        <div className="platform-parameters-field">
          <label className="platform-parameters-label">Comisión por Ticket (%)</label>
          <input
            type="number"
            className="platform-parameters-input"
            placeholder="Ej: 10"
            value={params.commissionPerTicket}
            onChange={(e) => handleChange("commissionPerTicket", e.target.value)}
            min="0"
            max="100"
          />
        </div>

        <div className="platform-parameters-field">
          <label className="platform-parameters-label">Máximo de Tickets por Compra</label>
          <input
            type="number"
            className="platform-parameters-input"
            placeholder="Ej: 10"
            value={params.maxTicketsPerPurchase}
            onChange={(e) => handleChange("maxTicketsPerPurchase", e.target.value)}
            min="1"
          />
        </div>

        <div className="platform-parameters-field">
          <label className="platform-parameters-label">Periodo de Reembolso (días)</label>
          <input
            type="number"
            className="platform-parameters-input"
            placeholder="Ej: 30"
            value={params.refundPeriodDays}
            onChange={(e) => handleChange("refundPeriodDays", e.target.value)}
            min="0"
          />
        </div>

        <div className="platform-parameters-field">
          <label className="platform-parameters-label">Periodo de Cancelación (días)</label>
          <input
            type="number"
            className="platform-parameters-input"
            placeholder="Ej: 7"
            value={params.cancellationPeriodDays}
            onChange={(e) => handleChange("cancellationPeriodDays", e.target.value)}
            min="0"
          />
        </div>
      </div>

      <div className="platform-parameters-actions">
        <button className="platform-parameters-button" onClick={handleSave}>
          <i className="bi bi-check-circle me-2"></i>
          Guardar configuración
        </button>
      </div>
    </div>
  )
}
