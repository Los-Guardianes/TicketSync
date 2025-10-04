import React from 'react'
import { NavBar } from '../../common/NavBar'
import { Card } from './components/Card'
import { PrimImage } from './components/PrimImage'

export const Home = () => {

  // Creo un arreglo de longitud 15 que tengan lo mismo
  const datosPrueba = Array(15).fill({
    ubicacion : "Av. La Marina 3477, San Miguel",
    titulo : "Peru VS Nueva Zelanda",
    dia : "Sabado 13 de set. - 7:00 pm",
  })

  return (
    <>
      <NavBar />
      <PrimImage />
      <div className='my-4 mx-auto w-75 d-flex justify-content-around flex-wrap gap-3'>
        {
          datosPrueba.map((item) =>
            <Card
              id={1} 
              ubicacion={item.ubicacion}
              titulo={item.titulo}
              dia={item.dia} />)
          // Este codigo es en JavaScript, es una iteracion
          // Lo hago para no crear uno por uno las cards
        }
      </div>
    </>
  )
}
