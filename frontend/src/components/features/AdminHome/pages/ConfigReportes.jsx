import { useNavigate } from "react-router-dom"
import { NavBarAdmin } from "../../../common/NavBarAdmin"
import { NavCard } from "../components/NavCard/NavCard"
import { getReporte, getReporteIngresos } from "../service/reporteService"
import "./ConfigReportes.css"
import { useState } from "react"
export const ConfigReportes = () =>{
    const navigate = useNavigate()
    const [isLoadingReport, setIsLoadingReport] = useState()
    
    const handleNavCardClick = async (title) => {

        switch (title) {
            case "Reporte-Organizadores":
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
            case "Reporte-Ingresos":
                console.log("Generando reporte...")
                setIsLoadingReport(true)
                try {
                    const { blob, filename } = await getReporteIngresos()
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
        }
    }

    return(
        <div className="admin-home-configreportes-container">
            <main className="admin-home-configreportes-main">
                    <div className="admin-home-configreportes-header">
                        <h1 className="admin-home-configreportes-tittle">
                            Seleccione el tipo de reporte que desea descargar
                        </h1>

                        <div className="admin-home-configreportes-grid">
                            {/* COLUMNA IZQUIERDA */}
                            <div className="admin-home-configreportes-left-column">
                                <div>
                                    <div className="admin-home-configreportes-nav-grid">
                                        <NavCard
                                            icon="graph-up"
                                            title="Reporte Organizadores"
                                            description="Reporte de organizadores registrados."
                                            onClick={() => handleNavCardClick("Reporte-Organizadores")}
                                        ></NavCard>
                                    </div>
                                </div>
                            </div>
                            {/* COLUMNA DERECHA */}
                            <div className="admin-home-configreportes-right-column">
                                <div>
                                    <div className="admin-home-configreportes-nav-grid">
                                        <NavCard
                                            icon="graph-up"
                                            title="Reporte de Ingresos"
                                            description="Reporte de los ingresos registrados de la plataforma"
                                            onClick={() => handleNavCardClick("Reporte-Ingresos")}
                                        ></NavCard>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
        </div>
    )
}