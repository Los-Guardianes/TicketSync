import { NavLink } from 'react-router-dom'
import "./Header.css"

export const Header = () => {
    return (
        <header 
            className="header-general">
            
            <NavLink to="/" className='navbar-brand'>
                <img src="/tuticket_logo_name.png"
                    alt="tuticketLogo" style={{ width: "7rem" }} />
            </NavLink>
        </header>
    )
}