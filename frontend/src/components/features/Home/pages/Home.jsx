import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { PrimImage } from '../components/PrimImage'
import { getEventos } from '../../../../globalServices/EventoService'
import { useOutletContext } from 'react-router-dom'

export const Home = () => {
  const [eventos, setEventos] = useState([])

  // Filtros que vienen de Layout (y que controla NavBar)
  const { search, ubicacion, fechaInicio, fechaFin, categoria } = useOutletContext()

  // Cargar eventos de la API
  useEffect(() => {
    const fetchEventos = async () => {
      const data = await getEventos()
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

    const inRange = (dateStr) => {
      if (!dateStr) return false;
      const d = dateStr; // yyyy-mm-dd (ISO)
      if (fechaInicio && !fechaFin) return d >= fechaInicio;
      if (!fechaInicio && fechaFin) return d <= fechaFin;
      if (fechaInicio && fechaFin) return d >= fechaInicio && d <= fechaFin;
      return true; // sin filtro de fecha
    };
    const matchFecha = (() => {
      if (!fechaInicio && !fechaFin) return true;
      const funciones = evento.funciones || [];
      return funciones.some(fn => inRange(fn.fechaInicio));
    })();

    const matchCategoria =
      (categoria === 'Todas') ||
      (evento.categoria && String(evento.categoria.idCategoria) === String(categoria));

    return matchSearch && matchUbicacion && matchFecha && matchCategoria;
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
