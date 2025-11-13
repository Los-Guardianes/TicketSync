"use client"

import { useState, useEffect } from "react"
import { Card } from "../components/Card"
import { PrimImage } from "../components/PrimImage"
import { getEventos } from "../../../../globalServices/EventoService"
import { useOutletContext } from "react-router-dom"
import "./Home.css"

export const Home = () => {
  const [eventos, setEventos] = useState([])

  // Filtros que vienen de Layout/NavBar
  const { search, ubicacion, fechaInicio, fechaFin, categoria } = useOutletContext()

  // Fecha de hoy en formato yyyy-mm-dd
  const today = new Date().toISOString().slice(0, 10)

  // Cargar eventos de la API
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getEventos()
        setEventos(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error cargando eventos:", error)
        setEventos([])
      }
    }
    fetchEventos()
  }, [])

  // Valida si una fecha (yyyy-mm-dd o ISO) es futura y, opcionalmente, cae en el rango seleccionado
  const inRange = (dateStr) => {
    if (!dateStr) return false
    const d = String(dateStr).slice(0, 10)

    // 1) Solo fechas futuras (incluye hoy)
    if (d < today) return false

    // 2) Filtros del NavBar (opcionales)
    if (fechaInicio && d < fechaInicio) return false
    if (fechaFin && d > fechaFin) return false

    return true
  }

  // Aplicar filtros
  const eventosFiltrados = eventos.filter((evento) => {
    // Si tu backend marca activo, respétalo. Si no viene, no filtres.
    const matchActivo = evento?.activo !== false

    // Búsqueda por nombre
    const matchSearch = !search || evento?.nombre?.toLowerCase().includes(search.toLowerCase())

    // Ubicación por nombre de dpto
    const matchUbicacion = ubicacion === "Todas" || evento?.ciudad?.dpto?.nombre === ubicacion

    // Categoría por nombre (case-insensitive) o por id si llegara así
    const matchCategoria =
      categoria === "Todas" ||
      (evento?.categoria?.nombre && evento.categoria.nombre.toLowerCase() === String(categoria).toLowerCase()) ||
      (evento?.categoria?.idCategoria && String(evento.categoria.idCategoria) === String(categoria))

    // Al menos una función futura y dentro del rango (si se eligió)
    const funciones = Array.isArray(evento?.funciones) ? evento.funciones : []
    const matchFecha = funciones.some((fn) => inRange(fn?.fechaInicio))

    return matchActivo && matchSearch && matchUbicacion && matchCategoria && matchFecha
  })

  return (
    <>
      <PrimImage />
      <div className="events-container">
        <div className="events-grid">
          {eventosFiltrados.length > 0 ? (
            eventosFiltrados.map((evento) => (
              <Card
                key={evento.idEvento}
                id={evento.idEvento}
                ubicacion={evento.direccion}
                titulo={evento.nombre}
                fecha={evento.funciones?.[0]?.fechaInicio || "Sin fecha definida"}
                ulrimagen={evento.urlImagen}
              />
            ))
          ) : (
            <p className="no-events-message">No hay eventos disponibles.</p>
          )}
        </div>
      </div>
    </>
  )
}
