// src/components/Sidebar/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
// import "./Sidebar.css"; // opcional: estilos propios, ver más abajo

export default function Sidebar() {
  return (
    <aside className="bg-light border-end p-3 tu-sidebar" style={{ minWidth: '220px', height: '100vh' }}>
      <h5 className="mb-4">TuTicket</h5>

      <nav className="nav flex-column">
        {/* Usamos NavLink para que la ruta activa reciba clases sin recargar la página */}
        <NavLink to="/perfil" className={({isActive}) => isActive ? 'nav-link active fw-bold' : 'nav-link'}>
          Mi perfil
        </NavLink>

        <NavLink to="/eventos" className={({isActive}) => isActive ? 'nav-link active fw-bold' : 'nav-link'}>
          Mis Eventos
        </NavLink>

        <NavLink to="/mistickets" className={({isActive}) => isActive ? 'nav-link active fw-bold' : 'nav-link'}>
          Mis Tickets
        </NavLink>

        <NavLink to="/faq" className={({isActive}) => isActive ? 'nav-link active fw-bold' : 'nav-link'}>
          Preguntas frecuentes
        </NavLink>

        <NavLink to="/privacidad" className={({isActive}) => isActive ? 'nav-link active fw-bold' : 'nav-link'}>
          Política de Privacidad
        </NavLink>
      </nav>
    </aside>
  );
}
