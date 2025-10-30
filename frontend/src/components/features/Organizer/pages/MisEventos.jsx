import React, { useEffect, useMemo, useState } from 'react';
import './MisEventos.css';
import { OrganizerEventCard } from '../components/OrganizerEventCard';
import { getEventosByOrganizer } from '../../../../globalServices/EventoService';
import { useAuth } from '../../../../context/AuthContext';
import { NavLink } from 'react-router-dom';

// Configura cuántas cards visibles por sección antes de mostrar "Ver más"/paginación
const PAGE_SIZE = 6;

const buildFunctionCards = (eventos) => {
  const upcoming = [];
  const past = [];
  const today = new Date();
  eventos.forEach(ev => {
    (ev.funciones || []).forEach(fn => {
      const fecha = fn.fechaInicio ? new Date(fn.fechaInicio) : null;
      if (!fecha) return;
      const card = {
        idEvento: ev.idEvento,
        idFuncion: fn.idFuncion,
        titulo: ev.nombre,
        direccion: ev.direccion,
        imagen: ev.urlImagen,
        fecha: fn.fechaInicio
      };
      (fecha < today ? past : upcoming).push(card);
    });
  });
  // Ordena: próximos ascendente, pasados descendente
  upcoming.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  past.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  return { upcoming, past };
};

const usePagination = (items, pageSize, showAll) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(1); }, [items, totalPages]);

  const visible = showAll ? items : items.slice((page - 1) * pageSize, page * pageSize);
  const showPager = !showAll && items.length > pageSize;

  return { visible, page, setPage, totalPages, showPager };
};

export const MisEventos = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventos, setEventos] = useState([]);

  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllPast, setShowAllPast] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getEventosByOrganizer(user.idUsuario);
        setEventos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar tus eventos.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.idUsuario) load();
  }, [user]);

  const { upcoming, past } = useMemo(() => buildFunctionCards(eventos), [eventos]);

  const upcomingPag = usePagination(upcoming, PAGE_SIZE, showAllUpcoming);
  const pastPag = usePagination(past, PAGE_SIZE, showAllPast);

  if (loading) return <div className="container py-4">Cargando...</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;

    return (
        <div className='d-flex'>
            {/* Barra lateral */}
            <aside className='bg-light border-end p-3' style={{ minWidth: '220px', height: '100vh' }}>
                <h5 className='mb-4'>TuTicket</h5>
                <nav className='nav flex-column'>
                    <NavLink to="/home" end className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold' : '')}>
                        Mi perfil
                    </NavLink>
                    <NavLink to="/organizer/mis-eventos" className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold' : '')}>
                        Mis Eventos
                    </NavLink>
                    <NavLink to="/mistickets" end className={({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold' : '')}>
                        Mis Tickets
                    </NavLink>
                    <NavLink to="/faq" className="nav-link">Preguntas frecuentes</NavLink>
                    <NavLink to="/privacidad" className="nav-link">Política de Privacidad</NavLink>
                </nav>
            </aside>


            {/* Contenido principal */}
            <main className='flex-grow-1 p-4'>
                <h3 className="mb-3">Mis Eventos</h3>

                <div className="row g-4">
                    <div className="col-12 col-lg-6">
                        {upcoming.length === 0 && <p className="text-muted">No tienes eventos próximos.</p>}
                        {upcomingPag.visible.map((it) => (
                            <OrganizerEventCard
                                key={`${it.idEvento}-${it.idFuncion}`}
                                id={it.idEvento}
                                titulo={it.titulo}
                                fecha={it.fecha}
                                direccion={it.direccion}
                                imagen={it.imagen}
                                actionLabel="Configurar"
                            />
                        ))}
                    </div>
                    <div className="col-12 col-lg-6">{/* segunda columna opcional */}</div>
                </div>

                {upcoming.length > PAGE_SIZE && (
                    <div className="d-flex align-items-center mt-3">
                        <button
                            className="btn btn-link p-0"
                            onClick={() => setShowAllUpcoming(s => !s)}
                        >
                            {showAllUpcoming ? 'Ver menos' : 'Ver más'}
                        </button>
                        <span className="ms-2 triangle-down" style={{ transform: showAllUpcoming ? 'rotate(180deg)' : 'none' }} />
                    </div>
                )}

                {!showAllUpcoming && upcomingPag.showPager && (
                    <div className="pagination-like d-flex gap-3 justify-content-center my-4">
                        <button className="btn btn-sm btn-light" disabled={upcomingPag.page === 1}
                            onClick={() => upcomingPag.setPage(p => Math.max(1, p - 1))}>
                            &lt;
                        </button>
                        {Array.from({ length: upcomingPag.totalPages }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                className={`btn btn-sm ${upcomingPag.page === n ? 'btn-success' : 'btn-light'}`}
                                onClick={() => upcomingPag.setPage(n)}
                            >
                                {n}
                            </button>
                        ))}
                        <button className="btn btn-sm btn-light" disabled={upcomingPag.page === upcomingPag.totalPages}
                            onClick={() => upcomingPag.setPage(p => Math.min(upcomingPag.totalPages, p + 1))}>
                            &gt;
                        </button>
                    </div>
                )}

                <h4 className="mt-4">Eventos Pasados</h4>

                <div className="row g-4">
                    <div className="col-12 col-lg-6">
                        {past.length === 0 && <p className="text-muted">Sin eventos pasados.</p>}
                        {pastPag.visible.map((it) => (
                            <OrganizerEventCard
                                key={`past-${it.idEvento}-${it.idFuncion}`}
                                id={it.idEvento}
                                titulo={it.titulo}
                                fecha={it.fecha}
                                direccion={it.direccion}
                                imagen={it.imagen}
                                actionLabel="Ver Detalle"
                            />
                        ))}
                    </div>
                </div>

                {/* Ver más (pasados) */}
                {past.length > PAGE_SIZE && (
                    <div className="d-flex align-items-center mt-3">
                        <button
                            className="btn btn-link p-0"
                            onClick={() => setShowAllPast(s => !s)}
                        >
                            {showAllPast ? 'Ver menos' : 'Ver más'}
                        </button>
                        <span className="ms-2 triangle-down" style={{ transform: showAllPast ? 'rotate(180deg)' : 'none' }} />
                    </div>
                )}

                {/* Paginación (pasados) */}
                {!showAllPast && pastPag.showPager && (
                    <div className="pagination-like d-flex gap-3 justify-content-center my-4">
                        <button className="btn btn-sm btn-light" disabled={pastPag.page === 1}
                            onClick={() => pastPag.setPage(p => Math.max(1, p - 1))}>
                            &lt;
                        </button>
                        {Array.from({ length: pastPag.totalPages }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                className={`btn btn-sm ${pastPag.page === n ? 'btn-success' : 'btn-light'}`}
                                onClick={() => pastPag.setPage(n)}
                            >
                                {n}
                            </button>
                        ))}
                        <button className="btn btn-sm btn-light" disabled={pastPag.page === pastPag.totalPages}
                            onClick={() => pastPag.setPage(p => Math.min(pastPag.totalPages, p + 1))}>
                            &gt;
                        </button>
                    </div>
                )}
            </main>
        </div>
    );

};
