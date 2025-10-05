import React from 'react'


export const Card = ({titulo, dia, ubicacion}) => {

    // Tengan en cuenta que esta card posee parametros, deben
    // Insertarse los argumentos en el componente para que se imprima

    return (
        <div className='card' style={{width: "15rem"}}>
            <img className='card-img-top' src="https://tuticket-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg"
                    alt="tuticketLogo"/>
            <div className='card-body'>
                <p className='card-text' >{ubicacion}</p>
                <h5 className='card-title' >{titulo}</h5>
                <p className='card-text' >{dia}</p>
                <button className='btn btn-primary'>COMPRAR</button>
            </div>
        </div>
    )
}
