import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'; //Importa el hook de login
export const NavBar = () => {
    const { user, logout } = useAuth(); //Usuario y la función logout
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
                {/*BOTÓN CONDICIONAL PARA ORGANIZADOR*/}
                {user && user.rol === 'organizador' && (
                    <li className='nav-item'>
                        <NavLink className={'nav-link btn btn-warning'} to={"/create-event"}>
                            Crear Evento
                        </NavLink>
                    </li>
                )}
                {/*LÓGICA CONDICIONAL LOGIN vs INFO DE USUARIO*/}
                {!user ? (
                    // Si NO hay usuario logueado, muestra Registrarse y Login
                    <>
                        <li className='nav-item'>
                            <NavLink className={'nav-link btn btn-light'} to={"/register"}>Registrarse</NavLink>
                        </li>
                        <li className='nav-item ms-2'> {/* ms-2 añade un margen */}
                            <NavLink className={'nav-link btn btn-success'} to={"/login"}>Login</NavLink>
                        </li>
                    </>
                ) : (
                    // Si SÍ hay usuario logueado, muestra su nombre y el botón de logout
                    <>
                        <li className='nav-item'>
                            {/* Suponiendo que el objeto de usuario tiene un campo 'nombre' */}
                            <span className='nav-link'>
                                👤 ¡Hola, {user.nombre}! 
                            </span>
                        </li>
                        <li className='nav-item ms-2'>
                            <button className={'nav-link btn btn-danger text-black'} onClick={logout}>
                                Cerrar Sesión
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
}
