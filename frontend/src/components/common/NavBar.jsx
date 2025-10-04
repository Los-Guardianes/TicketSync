import React from 'react'
import { NavLink } from 'react-router-dom'

export const NavBar = () => {
    // El to es el redirigimiento
    return (
        <nav className='navbar navbar-expand navbar-light bg-light border-bottom border-success d-flex justify-content-around'>
            <NavLink href="#" className='navbar-brand'>
                <img src="/tuticket_logo_name.png"
                    alt="tuticketLogo" style={{ width: "7rem" }} />
            </NavLink>
            <ul className='navbar-nav'>
                <li className='nav-item'>
                    <NavLink className={'nav-link'}>Precio</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink className={'nav-link'} to={"/"} >Ubicacion</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink className={'nav-link'} to={"/"} >Categoria</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink className={'nav-link'} to={"/"} >Fechas</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink className={'nav-link btn btn-light'} to={"/register"} >Registrarse</NavLink>
                </li>
                <li className='nav-item'>
                    <NavLink className={'nav-link btn btn-success'} to={"/login"} >Login</NavLink>
                </li>
            </ul>
        </nav>
    )
}
