import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

export const NavBar = ({
  search, setSearch,
  precio, setPrecio,
  ubicacion, setUbicacion,
  fecha, setFecha,
  ubicacionesDisponibles,
  categoria, setCategoria,
  categoriasDisponibles
}) => {
  const { user, logout } = useAuth();
  // Detecta rol de organizador con tolerancia a distintas formas de guardarlo
  const esOrganizador = user && user.rol === 'ORGANIZADOR';

  return (
    <nav className='navbar navbar-expand navbar-light bg-light border-bottom border-success px-3'>
      {/* Logo */}
      <NavLink to="/" className='navbar-brand'>
        <img
          src="/tuticket_logo_name.png"
          alt="tuticketLogo"
          style={{ width: "7rem" }}
        />
      </NavLink>

      {/* Barra de búsqueda */}
      <form className="d-flex mx-auto" style={{ width: "40%" }}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Encuentra eventos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      {/* Filtros */}
      <ul className="navbar-nav ms-auto d-flex align-items-center">

        {/* Precio */}
        <li className="nav-item dropdown">
          <NavLink className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown">
            Precio
          </NavLink>
          <ul className="dropdown-menu p-3">
            <label>Precio hasta: S/ {precio}</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
              className="form-range"
            />
          </ul>
        </li>

        {/* Ubicación dinámica */}
        <li className="nav-item dropdown">
          <NavLink className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown">
            Ubicación
          </NavLink>
          <ul className="dropdown-menu p-3">
            <select
              className="form-select"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            >
              <option value="Todas">Todas</option>
              {ubicacionesDisponibles.map(ubi => (
                <option key={ubi.idDpto} value={ubi.nombre}>{ubi.nombre}</option>
              ))}
            </select>
          </ul>
        </li>
        {/* Categoría */}
        <li className="nav-item dropdown">
          <NavLink className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown">
            Categoría
          </NavLink>
          <ul className="dropdown-menu p-3">
            <select
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="Todas">Todas</option>
              {categoriasDisponibles && categoriasDisponibles.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </ul>
        </li>

        {/* Fecha */}
        <li className="nav-item dropdown">
          <NavLink className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown">
            Fecha
          </NavLink>
          <ul className="dropdown-menu p-3">
            <div>
              <label><strong>Fecha de inicio:</strong></label> {/* el título para "Fecha de inicio" */}
              <input
                type="date"
                className="form-control"
                value={fecha[0]} // Fecha de inicio
                onChange={(e) => setFecha([e.target.value, fecha[1]])}
              />
            </div>
            <div className="mt-2">
              <label><strong>Fecha de fin:</strong></label> {/* título para "Fecha de fin" */}
              <input
                type="date"
                className="form-control"
                value={fecha[1]} // Fecha de fin
                onChange={(e) => setFecha([fecha[0], e.target.value])}
              />
            </div>
          </ul>
        </li>
        {/*BOTÓN CONDICIONAL PARA ORGANIZADOR*/}
        {user && user.rol === 'ORGANIZADOR' && (
          <li className='nav-item'>
            <NavLink className={'nav-link btn btn-warning'} to={"/create-event"}>
              Crear Evento
            </NavLink>
          </li>
        )}
        {/* Botones de usuario */}
        {!user ? (
          <>
            <li className='nav-item'>
              <NavLink className='nav-link btn btn-light' to={"/register"}>Registrarse</NavLink>
            </li>
            <li className='nav-item ms-2'>
              <NavLink className='nav-link btn btn-success' to={"/login"}>Login</NavLink>
            </li>
          </>
        ) : (
          <>
            <li className='nav-item'>
              <NavLink
                className="nav-link"
                to={esOrganizador ? "/organizer/mis-eventos" : "/mistickets"}
              >
                {esOrganizador ? "Mis Eventos" : "Mis Tickets"}
              </NavLink>
            </li>

            <li className='nav-item'>
              <span className='nav-link'>👤 ¡Hola, {user.nombre}!</span>
            </li>
            <li className='nav-item ms-2'>
              <button className='nav-link btn btn-danger text-black' onClick={logout}>
                Cerrar Sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
