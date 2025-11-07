import React, { useEffect, useMemo, useState } from 'react';
import './MisTickets.css';
import { getTickets } from '../service/MisTicketsService';
import { useAuth } from '../../../../context/AuthContext';
import { BarraLateral } from '../components/BarraLateral';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 6;

/** Normaliza fecha a Date (acepta ISO con hora, yyyy-mm-dd, dd/mm/yyyy) */
const toDate = (s) => {
  if (!s) return null;
  const str = String(s);
  let d = new Date(str);
  if (!isNaN(d)) return d;
  let m = str.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})/);
  if (m) {
    d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    if (!isNaN(d)) return d;
  }
  m = str.match(/^(\d{4})[\/-](\d{2})[\/-](\d{2})/);
  if (m) {
    d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    if (!isNaN(d)) return d;
  }
  return null;
};

/** Construye filas por EVENTO (agrupando tickets del usuario por idEvento) */
const buildEventRowsFromTickets = (tickets) => {
  const map = new Map();
  tickets.forEach(tk => {
    const oc = tk?.detalleCompra?.ordenCompra;
    const fn = oc?.funcion;
    const ev = fn?.evento;
    if (!ev?.idEvento) return;

    const evId = ev.idEvento;

    if (!map.has(evId)) {
      map.set(evId, {
        idEvento: evId,
        titulo: ev?.nombre ?? 'Evento',
        direccion: ev?.direccion ?? '',
        imagen: ev?.urlImagen ?? '',
        funciones: new Set(), // guardamos string crudo para deduplicar
        ticketsCount: 0,
      });
    }
    const entry = map.get(evId);
    entry.ticketsCount += 1;
    if (fn?.fechaInicio) entry.funciones.add(String(fn.fechaInicio));
  });

  const today = new Date();
  const rows = Array.from(map.values()).map(r => {
    const fechas = Array.from(r.funciones).map(toDate).filter(Boolean);
    const futuras = fechas.filter(d => d >= new Date(today.toDateString())); // hoy incluido
    futuras.sort((a, b) => a - b);
    const pasadas = fechas.filter(d => d < new Date(today.toDateString()));
    pasadas.sort((a, b) => b - a);

    return {
      ...r,
      proximaFecha: futuras[0] || null,
      hayFuturas: futuras.length > 0,
      ultimaPasada: pasadas[0] || null,
    };
  });

  // Separamos: con próximas funciones vs solo pasadas
  const upcoming = rows
    .filter(r => r.hayFuturas)
    .sort((a, b) => a.proximaFecha - b.proximaFecha);

  const past = rows
    .filter(r => !r.hayFuturas)
    .sort((a, b) => b.ultimaPasada - a.ultimaPasada);

  return { upcoming, past };
};

const usePagination = (items, pageSize, showAll) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [items, totalPages]);

  const visible = showAll ? items : items.slice((page - 1) * pageSize, page * pageSize);
  const showPager = !showAll && items.length > pageSize;

  return { visible, page, setPage, totalPages, showPager };
};

const EventRow = ({ imagen, titulo, fecha, direccion, ticketsCount, onDetail }) => (
  <div className="d-flex align-items-center bg-light rounded px-3 py-3 mb-3" style={{ boxShadow: '0 0 0 1px #e9ecef inset' }}>
    {/* Imagen */}
    <div className="me-3">
      <img
        src={imagen || '/placeholder_event.png'}
        alt={titulo}
        style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 8 }}
      />
    </div>

    {/* Info */}
    <div className="flex-grow-1">
      <div className="fw-semibold text-truncate d-flex align-items-center gap-2">
        <span>{titulo}</span>
        {!!ticketsCount && (
          <span className="badge bg-secondary">x{ticketsCount}</span>
        )}
      </div>
      {fecha && (
        <div className="text-muted" style={{ fontSize: 13 }}>
          {fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
      )}
      {direccion && <div className="text-muted" style={{ fontSize: 13 }}>{direccion}</div>}
    </div>

    {/* Botón */}
    <div className="ms-3">
      <button className="btn btn-success btn-sm" onClick={onDetail}>
        Ver Detalle
      </button>
    </div>
  </div>
);

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
    // ⚠️ Ajusta esta ruta a la de tu app de detalle de evento
    // Ejemplos típicos: `/evento/${idEvento}` o `/events/${idEvento}`
    navigate(`/evento/${idEvento}`);
  };

  if (loading) {
    return (
      <div className="d-flex">
        <BarraLateral />
        <main className="flex-grow-1 p-4">
          <h3 className="mb-3">Mis Tickets</h3>
          <p className="text-muted">Cargando...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex">
        <BarraLateral />
        <main className="flex-grow-1 p-4">
          <h3 className="mb-3">Mis Tickets</h3>
          <p className="text-danger">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <BarraLateral />

      <main className="flex-grow-1 p-4">
        <h3 className="mb-3">Mis Tickets</h3>

        {/* Próximos (por evento, sin duplicados) */}
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            {upcoming.length === 0 && (
              <p className="text-muted">No tienes tickets próximos.</p>
            )}

            {upcomingPag.visible.map(ev => (
              <EventRow
                key={ev.idEvento}
                imagen={ev.imagen}
                titulo={ev.titulo}
                fecha={ev.proximaFecha}
                direccion={ev.direccion}
                ticketsCount={ev.ticketsCount}
                onDetail={() => navigate(`/mis-tickets/evento/${ev.idEvento}`)}
              />
            ))}
          </div>
          <div className="col-12 col-lg-6">{/* para balance visual, opcional */}</div>
        </div>

        {/* Ver más / menos próximos */}
        {upcoming.length > PAGE_SIZE && (
          <div className="d-flex align-items-center mt-3">
            <button
              className="btn btn-link p-0"
              onClick={() => setShowAllUpcoming(s => !s)}
            >
              {showAllUpcoming ? 'Ver menos' : 'Ver más'}
            </button>
            <span
              className="ms-2 triangle-down"
              style={{ transform: showAllUpcoming ? 'rotate(180deg)' : 'none' }}
            />
          </div>
        )}

        {/* Paginación próximos */}
        {!showAllUpcoming && upcomingPag.showPager && (
          <div className="pagination-like d-flex gap-3 justify-content-center my-4">
            <button
              className="btn btn-sm btn-light"
              disabled={upcomingPag.page === 1}
              onClick={() => upcomingPag.setPage(p => Math.max(1, p - 1))}
            >
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
            <button
              className="btn btn-sm btn-light"
              disabled={upcomingPag.page === upcomingPag.totalPages}
              onClick={() => upcomingPag.setPage(p => Math.min(upcomingPag.totalPages, p + 1))}
            >
              &gt;
            </button>
          </div>
        )}

        {/* Pasados */}
        <h4 className="mt-4">Tickets Pasados</h4>

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            {past.length === 0 && (
              <p className="text-muted">Sin tickets pasados.</p>
            )}

            {pastPag.visible.map(ev => (
              <EventRow
                key={`past-${ev.idEvento}`}
                imagen={ev.imagen}
                titulo={ev.titulo}
                fecha={ev.ultimaPasada}
                direccion={ev.direccion}
                ticketsCount={ev.ticketsCount}
                onDetail={() => navigate(`/mis-tickets/evento/${ev.idEvento}`)}
              />
            ))}
          </div>
        </div>

        {/* Ver más / menos pasados */}
        {past.length > PAGE_SIZE && (
          <div className="d-flex align-items-center mt-3">
            <button
              className="btn btn-link p-0"
              onClick={() => setShowAllPast(s => !s)}
            >
              {showAllPast ? 'Ver menos' : 'Ver más'}
            </button>
            <span
              className="ms-2 triangle-down"
              style={{ transform: showAllPast ? 'rotate(180deg)' : 'none' }}
            />
          </div>
        )}

        {/* Paginación pasados */}
        {!showAllPast && pastPag.showPager && (
          <div className="pagination-like d-flex gap-3 justify-content-center my-4">
            <button
              className="btn btn-sm btn-light"
              disabled={pastPag.page === 1}
              onClick={() => pastPag.setPage(p => Math.max(1, p - 1))}
            >
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
            <button
              className="btn btn-sm btn-light"
              disabled={pastPag.page === pastPag.totalPages}
              onClick={() => pastPag.setPage(p => Math.min(pastPag.totalPages, p + 1))}
            >
              &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
