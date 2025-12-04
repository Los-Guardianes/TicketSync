import React from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext"
import "./NavBar.css"

export const NavBarAdmin = () => {

    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const cerrarSession = () => {
        logout();
        navigate("/login");
    }

    return (
        <nav className="navbar navbar-expand navbar-light bg-light border-bottom border-success px-3">
            <img
                src="/tuticket_logo_name.png"
                alt="tuticket Logo"
                style={{ width: "7rem", cursor: "pointer" }}
                onClick={() => navigate("/home-admin")}
            />
            <ul className={`navbar-nav ms-auto d-flex align-items-center`}>
                <>
                    <li className="nav-item">
                        <NavLink to="/perfil" className={({ isActive }) => isActive ? 'nav-link active fw-bold' : 'nav-link'}>
                            <span className="nav-link">¡Hola, {user?.nombre}!</span>
                        </NavLink>
                    </li>
                    <li className="nav-item ms-2">
                        <button className="btn btn-secondary" onClick={cerrarSession}>
                            Cerrar Sesión
                        </button>
                    </li>
                </>
            </ul>
        </nav>
    )
}