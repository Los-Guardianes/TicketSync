import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { PrimImage } from '../components/PrimImage'
import { getEventos } from '../../../../globalServices/EventoService'
import { useOutletContext } from 'react-router-dom'

export const Home = () => {
  const [eventos, setEventos] = useState([])

  // Filtros que vienen de Layout (y que controla NavBar)
  const { search, precio, ubicacion, fecha } = useOutletContext()


  // Cargar eventos de la API
  useEffect(() => {
    const fetchEventos = async () => {
      const data = await getEventos()
      //console.log(data); //ver la estructura de los objetos
      setEventos(data)
      console.log(data)
    }
    fetchEventos()
  }, [])

  // Aplicar filtros
  const eventosFiltrados = eventos.filter(evento => {
    // Búsqueda por nombre
    const matchSearch =
      !search || evento.nombre?.toLowerCase().includes(search.toLowerCase())

    const matchUbicacion =
      ubicacion === 'Todas' ||
      evento.ciudad?.dpto?.nombre === ubicacion

    const matchPrecio = true

    

    // fecha
    const matchFecha =
      (!fecha[0] && !fecha[1]) || // Si no hay fechas seleccionadas, no aplicar el filtro
      (evento.fecha &&
      new Date(evento.fecha) >= new Date(fecha[0]) &&
      new Date(evento.fecha) <= new Date(fecha[1])) // Si hay fechas seleccionadas, aplicamos el filtro


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
              fecha={evento.funciones[0]?.fechaInicio || 'Sin fecha definida'} //Del back viene con fecha ordenada
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
