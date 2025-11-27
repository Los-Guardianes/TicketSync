"use client"

import { useState } from "react"
import "./ReportGenerator.css"

export const ReportGenerator = ({ onDownload, isLoading }) => {
  const [reportType, setReportType] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [category, setCategory] = useState("")
  const [organizer, setOrganizer] = useState("")

  const handleDownload = () => {
    onDownload({
      reportType,
      dateRange,
      category,
      organizer,
    })
  }

  return (
    <div className="report-generator">
      <div className="report-generator-header">
        <div className="report-generator-icon">
          <i className="bi bi-file-earmark-spreadsheet"></i>
        </div>
        <h3 className="report-generator-title">Generador de Reportes</h3>
      </div>
      <p className="report-generator-description">
        Configura y descarga reportes personalizados según tus necesidades.
      </p>

      <div className="report-generator-form">
        <div className="report-generator-row">
          <div className="report-generator-field">
            <label className="report-generator-label">Tipo de Reporte</label>
            <select
              className="report-generator-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="">Seleccionar tipo de reporte</option>
              <option value="ventas">Reporte de Ventas</option>
              <option value="eventos">Reporte de Eventos</option>
              <option value="usuarios">Reporte de Usuarios</option>
            </select>
          </div>

          <div className="report-generator-field">
            <label className="report-generator-label">Rango de Fechas</label>
            <select
              className="report-generator-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="">Seleccionar periodo</option>
              <option value="mes">Este Mes</option>
              <option value="trimestre">Este Trimestre</option>
              <option value="anio">Este Año</option>
            </select>
          </div>
        </div>

        <div className="report-generator-row">
          <div className="report-generator-field">
            <label className="report-generator-label">Categoría</label>
            <select className="report-generator-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Todas las categorías</option>
              <option value="musica">Música</option>
              <option value="deportes">Deportes</option>
              <option value="cine">Cine</option>
            </select>
          </div>

          <div className="report-generator-field">
            <label className="report-generator-label">Organizador</label>
            <select
              className="report-generator-select"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
            >
              <option value="">Todos los Organizadores</option>
              <option value="org1">Organizador 1</option>
              <option value="org2">Organizador 2</option>
            </select>
          </div>
        </div>
      </div>

      <div className="report-generator-actions">
        <button className="report-generator-button" onClick={handleDownload} disabled={isLoading}>
          <i className="bi bi-download"></i>
          {isLoading ? "Descargando..." : "Descargar en Excel"}
        </button>
      </div>
    </div>
  )
}
