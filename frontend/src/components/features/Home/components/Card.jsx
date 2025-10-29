import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../../context/AuthContext";
export const Card = ({id, titulo, fecha, ubicacion,ulrimagen}) => {

    // Tengan en cuenta que esta card posee parametros, deben
    // Insertarse los argumentos en el componente para que se imprima

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const start_purchase = () => {
        const target = `/ticket-purchase/${id}`;
        if (!isAuthenticated) navigate('/login', { state: { from: target } });
        else navigate(target);
    }

    return (
        <div className='card' style={{width: "15rem"}}>
            <img className='card-img-top' src={ulrimagen} alt="ImagenDeEvento"/>
            <div className='card-body'>
                <p className='card-text' >{ubicacion}</p>
                <h5 className='card-title' >{titulo}</h5>
                <p className='card-text' >{fecha}</p>
                <button className='btn btn-primary' onClick={start_purchase}>COMPRAR</button>
            </div>
        </div>
    )
}
