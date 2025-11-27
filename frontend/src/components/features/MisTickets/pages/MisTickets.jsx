import React, { useEffect, useMemo, useState } from 'react';
import './MisTickets.css';
import { getTickets, buildEventRowsFromTickets, usePagination } from '../service/MisTicketsService';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TicketCard from '../components/TicketCard';

const PAGE_SIZE = 6;

export const MisTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);

  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllPast, setShowAllPast] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!user?.idUsuario) return;
        const data = await getTickets(user.idUsuario);
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al obtener tickets:', err);
        setError('No se pudieron cargar tus tickets.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.idUsuario]);

  const { upcoming, past } = useMemo(
    () => buildEventRowsFromTickets(tickets),
    [tickets]
  );

  const upcomingPag = usePagination(upcoming, PAGE_SIZE, showAllUpcoming);
  const pastPag = usePagination(past, PAGE_SIZE, showAllPast);

  const goToEventDetail = (idEvento) => {
    navigate(`/mis-tickets/evento/${idEvento}`);
  };

  // Componente para estado vacío
  const EmptyState = ({ message }) => (
    <div className="empty-state">
      <div className="empty-state__content">
        <div className="empty-state__image-container">
          <img 
            src="/src/assets/TuTicket_Sin_Palabras.png" 
            alt="TuTicket" 
            className="empty-state__image"
          />
          <div className="empty-state__gradient"></div>
        </div>
        <p className="empty-state__message">{message}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="mis-tickets-container">
        <div className="mis-tickets-wrapper">
          <div className="mis-tickets-header">
            <div className="mis-tickets-header__content">
              <h1 className="mis-tickets-header__title">Mis Tickets</h1>
              <p className="mis-tickets-header__subtitle">Gestiona tus eventos y tickets</p>
            </div>
          </div>
          <EmptyState message="Cargando tus tickets..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-tickets-container">
        <div className="mis-tickets-wrapper">
          <div className="mis-tickets-header">
            <div className="mis-tickets-header__content">
              <h1 className="mis-tickets-header__title">Mis Tickets</h1>
              <p className="mis-tickets-header__subtitle">Gestiona tus eventos y tickets</p>
            </div>
          </div>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-tickets-container">
      <div className="mis-tickets-wrapper">
        {/* Header Mejorado */}
        <div className="mis-tickets-header__content">
           <h1 className="mis-tickets-header__title">Mis Tickets</h1>
        </div>


        {/* Próximos Eventos */}
        <div className="tickets-section tickets-section--upcoming">
          <div className="tickets-section__header">
            <div className="tickets-section__title-content">
              <h2 className="tickets-section__title">
                Próximos Eventos
              </h2>
              <p className="tickets-section__description">
                Eventos activos y por venir
              </p>
            </div>
            {upcoming.length > 0 && (
              <div className="tickets-section__count">
                {upcoming.length} evento{upcoming.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {upcoming.length === 0 ? (
            <EmptyState message="No tienes tickets próximos." />
          ) : (
            <>
              <div className="tickets-grid">
                {upcomingPag.visible.map(ev => (
                  <TicketCard
                    key={ev.idEvento}
                    imagen={ev.imagen}
                    titulo={ev.titulo}
                    fecha={ev.proximaFecha}
                    direccion={ev.direccion}
                    ticketsCount={ev.ticketsCount}
                    onDetail={() => goToEventDetail(ev.idEvento)}
                    esPasado={false}
                  />
                ))}
              </div>

              {upcoming.length > PAGE_SIZE && (
                <div className="toggle-more">
                  <button 
                    className="toggle-button btn-secondary"
                    onClick={() => setShowAllUpcoming(s => !s)}
                  >
                    {showAllUpcoming ? '▼ Ver menos' : '▶ Ver más eventos'}
                  </button>
                </div>
              )}

              {!showAllUpcoming && upcomingPag.showPager && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    disabled={upcomingPag.page === 1}
                    onClick={() => upcomingPag.setPage(p => Math.max(1, p - 1))}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: upcomingPag.totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      className={`pagination-button ${upcomingPag.page === n ? 'active' : ''}`}
                      onClick={() => upcomingPag.setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="pagination-button"
                    disabled={upcomingPag.page === upcomingPag.totalPages}
                    onClick={() => upcomingPag.setPage(p => Math.min(upcomingPag.totalPages, p + 1))}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Tickets Pasados */}
        <div className="tickets-section tickets-section--past">
          <div className="tickets-section__header">
            <div className="tickets-section__title-content">
              <h2 className="tickets-section__title">
                Eventos Finalizados
              </h2>
              <p className="tickets-section__description">
                Tu historial de eventos asistidos
              </p>
            </div>
            {past.length > 0 && (
              <div className="tickets-section__count">
                {past.length} evento{past.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {past.length === 0 ? (
            <EmptyState message="Sin tickets pasados." />
          ) : (
            <>
              <div className="tickets-grid">
                {pastPag.visible.map(ev => (
                  <TicketCard
                    key={`past-${ev.idEvento}`}
                    imagen={ev.imagen}
                    titulo={ev.titulo}
                    fecha={ev.ultimaPasada}
                    direccion={ev.direccion}
                    ticketsCount={ev.ticketsCount}
                    onDetail={() => goToEventDetail(ev.idEvento)}
                    esPasado={true}
                  />
                ))}
              </div>

              {past.length > PAGE_SIZE && (
                <div className="toggle-more">
                  <button 
                    className="toggle-button btn-secondary"
                    onClick={() => setShowAllPast(s => !s)}
                  >
                    {showAllPast ? '▼ Ver menos' : '▶ Ver más eventos'}
                  </button>
                </div>
              )}

              {!showAllPast && pastPag.showPager && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    disabled={pastPag.page === 1}
                    onClick={() => pastPag.setPage(p => Math.max(1, p - 1))}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: pastPag.totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      className={`pagination-button ${pastPag.page === n ? 'active' : ''}`}
                      onClick={() => pastPag.setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="pagination-button"
                    disabled={pastPag.page === pastPag.totalPages}
                    onClick={() => pastPag.setPage(p => Math.min(pastPag.totalPages, p + 1))}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};