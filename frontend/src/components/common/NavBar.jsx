import React from 'react'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCateventos } from '../../globalServices/EventoService'
import { useAuth } from '../../context/AuthContext';

export const NavBar = ({
  search, setSearch,
  ubicacion, setUbicacion,
  fechaInicio, setFechaInicio,
  fechaFin, setFechaFin,
  categoria, setCategoria,
  ubicacionesDisponibles
}) => {
  const { user, logout } = useAuth();
  // Detecta rol de organizador con tolerancia a distintas formas de guardarlo
  const esOrganizador = user && user.rol === 'ORGANIZADOR';
  const [categorias, setCategorias] = useState([{ idCategoria: 0, nombre: 'Todas' }]);
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // evita que Enter recargue/navegue
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getCateventos();
        const arr = Array.isArray(data) ? data : (data?.data ?? data?.content ?? data?.items ?? []);
        const activas = (Array.isArray(arr) ? arr : []).filter(c => c?.activo === true);
        setCategorias([{ idCategoria: 0, nombre: 'Todas' }, ...activas]);
      } catch (e) {
        console.error('Error cargando categorías', e);
        setCategorias([{ idCategoria: 0, nombre: 'Todas' }]);
      }
    })();
  }, []);

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
      <form className="d-flex mx-auto" style={{ width: "40%" }} onSubmit={handleSearchSubmit} noValidate>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Encuentra eventos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} // evita submit con Enter
        />
      </form>


      {/* Filtros */}
      <ul className="navbar-nav ms-auto d-flex align-items-center">



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

        {/* Fecha */}
        <li className="nav-item dropdown">
          <NavLink className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown">
            Fecha
          </NavLink>
          <ul className="dropdown-menu p-3">
            <label className="form-label small">Desde</label>
            <input
              type="date"
              className="form-control mb-2"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <label className="form-label small">Hasta</label>
            <input
              type="date"
              className="form-control"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </ul>
        </li>

        {/* Categoría */}
        <li className="nav-item dropdown ms-2">
          <NavLink className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown">
            Categoría
          </NavLink>
          <ul className="dropdown-menu p-3">
            <select
              className="form-select"
              value={String(categoria)}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {categorias.map(cat => (
                <option
                  key={cat.idCategoria}
                  value={cat.idCategoria === 0 ? 'Todas' : String(cat.idCategoria)}
                >
                  {cat.nombre}
                </option>
              ))}
            </select>
          </ul>
        </li>

        {/* BOTÓN CONDICIONAL PARA ORGANIZADOR */}
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
