// src/components/pages/MisTickets/MisTickets.jsx
import React, { useState, useEffect } from 'react';
import './MisTickets.css';
import { getTickets } from '../../../services/MisTicketsService';
import { abrirTicket } from '../../../services/PDFService';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../common/Sidebar/Sidebar'; // <-- IMPORTA el Sidebar

export const MisTickets = () => {
  const [tickets, setTickets] = useState([]);
  const { user, logout } = useAuth();

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
      {/* Sidebar reutilizable */}
      <Sidebar />

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
