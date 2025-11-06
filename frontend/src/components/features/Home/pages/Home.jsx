import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { PrimImage } from '../components/PrimImage'
import { getEventos } from '../../../../globalServices/EventoService'
import { useOutletContext } from 'react-router-dom'

export const Home = () => {
  const [eventos, setEventos] = useState([])

  // Filtros que vienen de Layout (y que controla NavBar)
  const { search, ubicacion, fechaInicio, fechaFin, categoria } = useOutletContext()

  // Fecha de hoy en formato yyyy-mm-dd
  const today = new Date().toISOString().slice(0, 10)

  // Cargar eventos de la API
  useEffect(() => {
    const fetchEventos = async () => {
      const data = await getEventos()
      setEventos(data)
      console.log(data)
    }
    fetchEventos()
  }, [])

  // Función para validar rango de fechas + que sea futuro
  const inRange = (dateStr) => {
    if (!dateStr) return false

    // Si viene con hora, nos quedamos solo con yyyy-mm-dd
    const d = String(dateStr).slice(0, 10)

    // 1) Solo fechas futuras (o hoy). Cambia a d <= today si quieres excluir hoy.
    if (d < today) return false

    // 2) Aplicar filtros del NavBar si existen
    if (fechaInicio && d < fechaInicio) return false
    if (fechaFin && d > fechaFin) return false

    return true
  }

  // Aplicar filtros
  const eventosFiltrados = eventos.filter(evento => {
    const matchActivo = evento?.activo === true

    // Búsqueda por nombre
    const matchSearch =
      !search || evento.nombre?.toLowerCase().includes(search.toLowerCase())

    const matchUbicacion =
      ubicacion === 'Todas' ||
      evento.ciudad?.dpto?.nombre === ubicacion

    const matchFecha = (() => {
      const funciones = evento.funciones || []
      // Al menos una función debe ser futura y estar dentro del rango (si lo hay)
      return funciones.some(fn => inRange(fn?.fechaInicio))
    })()

    const matchCategoria =
      categoria === 'Todas' ||
      (evento.categoria && String(evento.categoria.idCategoria) === String(categoria))

    return matchActivo && matchSearch && matchUbicacion && matchFecha && matchCategoria
  })

  return (
    <>
      <PrimImage />
      <div className='my-4 mx-auto w-75 d-flex justify-content-around flex-wrap gap-3'>
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map(evento => (
            <Card
              key={evento.idEvento}
              id={evento.idEvento}
              ubicacion={evento.direccion}
              titulo={evento.nombre}
              fecha={evento.funciones[0]?.fechaInicio || 'Sin fecha definida'}
              ulrimagen={evento.urlImagen || 'Sin imagen disponible'}
            />
          ))
        ) : (
          <p className='text-center mt-5'>No hay eventos disponibles.</p>
        )}
      </div>
    </>
  )
}
