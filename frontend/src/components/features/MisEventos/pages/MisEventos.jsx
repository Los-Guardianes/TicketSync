import React, { useState, useEffect } from 'react'
import { getMisEventos } from '../service/MisEventosService';
import { useAuth } from '../../../../context/AuthContext'; //Importa el hook de login

export const MisEventos = () => {
  const [eventos, setEventos] = useState([]);
  const { user, logout } = useAuth(); //Usuario y la función logout
  // Obtenemos los tickets de la API
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getMisEventos(user.idUsuario);
        setEventos(data);
      } catch (err) {
        console.error('Error al obtener eventos:', err);
      }
    };
    fetchEventos();
  }, []);

  return (
    <div className='d-flex'>
      {/* Barra lateral */}
      <aside className='bg-light border-end p-3' style={{ minWidth: '220px', height: '100vh' }}>
        <h5 className='mb-4'>TuTicket</h5>
        <nav className='nav flex-column'>
          <a className='nav-link' href='/perfil'>Mi perfil</a>
          <a className='nav-link active fw-bold' href='/eventos'>Mis Eventos</a>
          <a className='nav-link' href='/mistickets'>Mis Tickets</a>
          <a className='nav-link' href='/faq'>Preguntas frecuentes</a>
          <a className='nav-link' href='/privacidad'>Política de Privacidad</a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className='flex-grow-1 p-4'>
{/*         <h4 className='mb-3'>Mis Tickets</h4>

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

        <h4 className='mb-3'>Tickets Pasados</h4> */}
        {/* Sección vacía por ahora */}
      </main>
    </div>
  );
};