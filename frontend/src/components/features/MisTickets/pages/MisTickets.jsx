import React, { useState, useEffect } from 'react'
import './MisTickets.css';
import { getTickets } from '../service/MisTicketsService';
import { abrirTicket } from '../../../../globalServices/PDFService';
import { useAuth } from '../../../../context/AuthContext'; //Importa el hook de login
import { NavLink } from 'react-router-dom';

export const MisTickets = () => {
  const [tickets, setTickets] = useState([]);
  const { user, logout } = useAuth(); //Usuario y la función logout
  const esOrganizador = user?.rol === 'ORGANIZADOR'; // usa el mismo check que ya te funciona

  // Obtenemos los tickets de la API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets(user.idUsuario);
        setTickets(data);
      } catch (err) {
        console.error('Error al obtener tickets:', err);
      }
    };
    fetchTickets();
  }, []);

  const handleVerTicket = async (id) => {
    try {
      await abrirTicket(id);
    } catch (err) {
      console.error(`Error al abrir el ticket ${id}:`, err);
    }
  };

  return (
    <div className='d-flex'>
      {/* Barra lateral */}

      <aside className='bg-light border-end p-3' style={{ minWidth: '220px', height: '100vh' }}>
        <h5 className='mb-4'>TuTicket</h5>
        <nav className='nav flex-column'>
          <NavLink
            to="/home"
            end
            className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold' : '')}
          >
            Mi perfil
          </NavLink>

          {esOrganizador && (
            <NavLink
              to="/organizer/mis-eventos"
              className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold' : '')}
            >
              Mis Eventos
            </NavLink>
          )}


          <NavLink
            to="/mistickets"
            end
            className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold' : '')}
          >
            Mis Tickets
          </NavLink>

          <NavLink to="/faq" className="nav-link">Preguntas frecuentes</NavLink>
          <NavLink to="/privacidad" className="nav-link">Política de Privacidad</NavLink>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className='flex-grow-1 p-4'>
        <h4 className='mb-3'>Mis Tickets</h4>

        {tickets.length > 0 ? (
          <div className='d-flex overflow-auto gap-3 pb-2'>
            {tickets.map((ticket) => (
              <div
                key={ticket.idTicket}
                className='border rounded p-3 bg-light d-flex flex-column justify-content-between'
                style={{ minWidth: '200px', maxWidth: '250px' }}
              >
                <h6 className='mb-3 text-truncate'>{ticket.detalleCompra.ordenCompra.funcion.evento.nombre}</h6>
                <button
                  className='btn btn-primary btn-sm'
                  onClick={() => handleVerTicket(ticket.idTicket)}
                >
                  Ver ticket
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-muted mt-4'>Aún no tienes tickets.</p>
        )}

        <hr className='my-5' />

        <h4 className='mb-3'>Tickets Pasados</h4>
        {/* Sección vacía por ahora */}
      </main>
    </div>
  );
};