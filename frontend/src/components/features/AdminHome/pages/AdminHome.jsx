"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { NavBarAdmin } from "../../../common/NavBarAdmin"
import { NavCard } from "../components/NavCard/NavCard"
import { ReportGenerator } from "../components/ReportGenerator/ReportGenerator"
import { PlatformParameters } from "../components/PlatformParameters/PlatformParameters"
import { QuickStats } from "../components/QuickStats/QuickStats"
import { getReporte } from "../service/reporteService"
import "./AdminHome.css"

export const AdminHome = () => {
  const navigate = useNavigate()
  const [isLoadingReport, setIsLoadingReport] = useState(false)

  const handleNavCardClick = async (title) => {
    switch (title) {
      case "Reportes":
        console.log("Generando reporte...")
        setIsLoadingReport(true)
        try {
          const { blob, filename } = await getReporte()
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", filename)
          document.body.appendChild(link)
          link.click()
          link.parentNode.removeChild(link)
          window.URL.revokeObjectURL(url)
        } catch (error) {
          console.error("Error al descargar el archivo:", error)
          alert("Error al descargar el reporte. " + error.message)
        } finally {
          setIsLoadingReport(false)
        }
        break
      case "Gestionar Roles":
        navigate("/configusers")
        break
      case "Configurar Comisión":
        navigate("/configparams")
        break
      default:
        break
    }
  }

  const handleReportDownload = async (config) => {
    console.log("Descargando reporte con configuración:", config)
    await handleNavCardClick("Reportes")
  }

  const handleParametersSave = (params) => {
    console.log("Guardando parámetros:", params)
    alert("Configuración guardada correctamente")
  }

  const stats = {
    activeEvents: 247,
    organizers: 89,
    ticketsSoldMonth: "12,456",
    monthlyRevenue: "45,230",
  }

  return (
    <div className="admin-home-container">
      <NavBarAdmin />

      <main className="admin-home-content">
        <div className="admin-home-main">
          <div className="admin-home-header">
            <h1 className="admin-home-title">Ajustes de la plataforma</h1>
            <p className="admin-home-subtitle">Gestiona la configuración general y los parámetros del sistema</p>
          </div>

          <div className="admin-home-grid">
            {/* LEFT COLUMN */}
            <div className="admin-home-left-column">
              <div>
                <div className="admin-home-nav-grid">
                  <NavCard
                    icon="graph-up"
                    title="Reportes"
                    description="Genera y visualiza reportes detallados."
                    onClick={() => handleNavCardClick("Reportes")}
                  />
                  <NavCard
                    icon="pencil-square"
                    title="Modificar Categorías"
                    description="Gestiona categorías de eventos y tickets."
                    onClick={() => handleNavCardClick("Modificar Categorías")}
                  />
                </div>

                <div className="admin-home-nav-grid">
                  <NavCard
                        icon="person-rolodex"
                        title="Gestionar Roles"
                        description="Administra roles y permisos de usuarios."
                        onClick={() => handleNavCardClick("Gestionar Roles")}
                      />
                  <NavCard
                    icon="percent"
                    title="Configurar Comisión"
                    description="Establece el porcentaje de comisión."
                    onClick={() => handleNavCardClick("Configurar Comisión")}
                  />
                </div>

              </div>
              {/*
              <ReportGenerator onDownload={handleReportDownload} isLoading={isLoadingReport} />
              */}
            </div>
            {/*
            
            <div className="admin-home-right-column">
              <PlatformParameters onSave={handleParametersSave} />
              <QuickStats stats={stats} />
            </div>
            */}
          </div>
        </div>
      </main>
    </div>
  )
}
