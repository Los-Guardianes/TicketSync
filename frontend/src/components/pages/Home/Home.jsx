import React, { useState, useEffect } from 'react'
import { Card } from './components/Card'
import { PrimImage } from './components/PrimImage'
import { getEventos } from '../../../services/EventoService'
//Luis come pene
export const Home = () => {
  const [eventos, setEventos] = useState([])

  // Obtenemos los eventos de la API
  useEffect(() => {
    const fetchEventos = async () => {
      const data = await getEventos()
      setEventos(data)
    }
    fetchEventos()
  }, [])

  return (
    <>
      <PrimImage />
      <div className='my-4 mx-auto w-75 d-flex justify-content-around flex-wrap gap-3'>
        {/* Este código es una iteración dinámica de eventos */}
        {
          eventos.length > 0 ? (
            eventos.map((evento) => (
              <Card
                key={evento.idEvento}
                id={evento.idEvento}
                ubicacion={evento.direccion}
                titulo={evento.nombre}
                dia={evento.fecha || 'Sin fecha definida'}
                ulrimagen={evento.ulrimagen || 'Sin imagen disponible'}
              />
            ))
          ) : (
            <p className='text-center mt-5'>No hay eventos disponibles.</p>
          )
        }
      </div>
    </>
  )
}
