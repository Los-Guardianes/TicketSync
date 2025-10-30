import React from 'react'
import { NavLink } from 'react-router-dom'

export const NavBarAdmin = () => {
    return (
        <nav className='navbar navbar-expand navbar-light bg-light border-bottom border-success px-3'>
            <NavLink to="/" className='navbar-brand'>
                <img
                    src="/tuticket_logo_name.png"
                    alt="tuticketLogo"
                    style={{ width: "7rem" }}
                />
            </NavLink>
        </nav>
    )
}