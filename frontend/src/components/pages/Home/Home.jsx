import React, { useState, useEffect } from 'react'
import { Card } from './components/Card'
import { PrimImage } from './components/PrimImage'
import { getEventos } from '../../../services/EventoService'
import { useOutletContext } from 'react-router-dom'

export const Home = () => {
  const [eventos, setEventos] = useState([])

  // Filtros que vienen de Layout (y que controla NavBar)
  const { search, precio, ubicacion, fecha } = useOutletContext()

  // Cargar eventos de la API
  useEffect(() => {
    const fetchEventos = async () => {
      const data = await getEventos()
      setEventos(data)
    }
    fetchEventos()
  }, [])

  // Aplicar filtros
  const eventosFiltrados = eventos.filter(evento => {
    // Búsqueda por nombre
    const matchSearch =
      !search || evento.nombre?.toLowerCase().includes(search.toLowerCase())

    // ubicación dinámica
    const matchUbicacion =
      ubicacion === 'Todas' ||
      evento.ciudad?.dpto?.nombre === ubicacion

    // precio (placeholder: siempre true Por ahora )
    const matchPrecio = true

    // fecha
    const matchFecha =
      !fecha || (evento.fecha && evento.fecha.startsWith(fecha))

    return matchSearch && matchUbicacion && matchPrecio && matchFecha
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
              dia={evento.fecha || 'Sin fecha definida'}
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
