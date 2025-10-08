import React from 'react'
import { useNavigate } from 'react-router-dom';

export const Card = ({id, titulo, dia, ubicacion,ulrimagen}) => {

    // Tengan en cuenta que esta card posee parametros, deben
    // Insertarse los argumentos en el componente para que se imprima

    const navigate = useNavigate();

    const start_purchase = () => {
        navigate(`/ticket-purchase/${id}`);
    }

    return (
        <div className='card' style={{width: "15rem"}}>
            {/*<img className='card-img-top' src="https://tuticket-bucket.s3.us-east-1.amazonaws.com/maxresdefault.jpg"
                    alt="tuticketLogo"/>*/}
            <img className='card-img-top' src={ulrimagen} alt="ImagenDeEvento"/>
            <div className='card-body'>
                <p className='card-text' >{ubicacion}</p>
                <h5 className='card-title' >{titulo}</h5>
                <p className='card-text' >{dia}</p>
                <button className='btn btn-primary' onClick={start_purchase}>COMPRAR</button>
            </div>
        </div>
    )
}
