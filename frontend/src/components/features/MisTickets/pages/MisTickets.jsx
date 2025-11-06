import React, { useEffect, useMemo, useState } from 'react';
import './MisTickets.css'; // Asegúrate que tenga .triangle-down y .pagination-like (mismo que MisEventos.css)
import { getTickets } from '../service/MisTicketsService';
import { abrirTicket } from '../../../../globalServices/PDFService';
import { useAuth } from '../../../../context/AuthContext';
import { BarraLateral } from '../components/BarraLateral';

// Cantidad de filas visibles antes de mostrar "Ver más" / paginación
const PAGE_SIZE = 6;

/** Convierte tus tickets del backend en filas (cards) individuales y separa futuras/pasadas */
const buildTicketRows = (tickets) => {
  const upcoming = [];
  const past = [];
  const today = new Date();

  tickets.forEach(tk => {
    const oc = tk?.detalleCompra?.ordenCompra;
    const fn = oc?.funcion;
    const ev = fn?.evento;

    const fechaStr = fn?.fechaInicio;
    const fecha = fechaStr ? new Date(fechaStr) : null;
    if (!fecha) return;

    const row = {
      idTicket: tk.idTicket,
      titulo: ev?.nombre ?? 'Evento',
      direccion: ev?.direccion ?? '',
      imagen: ev?.urlImagen ?? '',
      fecha: fechaStr
    };

    if (fecha < today) {
      past.push(row);
    } else {
      upcoming.push(row);
    }
  });

  // Orden: próximos asc, pasados desc
  upcoming.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  past.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return { upcoming, past };
};

/** Hook de paginación reutilizable (igual idea que en MisEventos) */
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

/** Fila visual del ticket (imagen izquierda, info, botón verde a la derecha) */
const TicketRow = ({ imagen, titulo, fecha, direccion, onAction }) => (
  <div className="d-flex align-items-center bg-light rounded px-3 py-3 mb-3" style={{ boxShadow: '0 0 0 1px #e9ecef inset' }}>
    {/* Imagen */}
    <div className="me-3">
      <img
        src={imagen || '/placeholder_event.png'}
        alt={titulo}
        style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 8 }}
      />
    </div>

    {/* Texto */}
    <div className="flex-grow-1">
      <div className="fw-semibold text-truncate">{titulo}</div>
      <div className="text-muted" style={{ fontSize: 13 }}>
        {new Date(fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
      </div>
      {direccion && <div className="text-muted" style={{ fontSize: 13 }}>{direccion}</div>}
    </div>

    {/* Acción */}
    <div className="ms-3">
      <button className="btn btn-success btn-sm" onClick={onAction}>
        Ver Ticket
      </button>
    </div>
  </div>
);

export const MisTickets = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState([]);

  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllPast, setShowAllPast] = useState(false);

  // Cargar tickets del usuario
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

  // Construir listas próximas y pasadas
  const { upcoming, past } = useMemo(() => buildTicketRows(tickets), [tickets]);

  // Paginación
  const upcomingPag = usePagination(upcoming, PAGE_SIZE, showAllUpcoming);
  const pastPag = usePagination(past, PAGE_SIZE, showAllPast);

  const handleVerTicket = async (idTicket) => {
    try {
      await abrirTicket(idTicket);
    } catch (err) {
      console.error(`Error al abrir el ticket ${idTicket}:`, err);
    }
  };

  // Loading / Error
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

  // Render normal (igual estructura visual que MisEventos)
  return (
    <div className="d-flex">
      <BarraLateral />

      <main className="flex-grow-1 p-4">
        <h3 className="mb-3">Mis Tickets</h3>

        {/* Próximos */}
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            {upcoming.length === 0 && (
              <p className="text-muted">No tienes tickets próximos.</p>
            )}

            {upcomingPag.visible.map((tk) => (
              <TicketRow
                key={tk.idTicket}
                imagen={tk.imagen}
                titulo={tk.titulo}
                fecha={tk.fecha}
                direccion={tk.direccion}
                onAction={() => handleVerTicket(tk.idTicket)}
              />
            ))}
          </div>

          <div className="col-12 col-lg-6">{/* columna libre opcional */}</div>
        </div>

        {/* Ver más / Ver menos (próximos) */}
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

            {pastPag.visible.map((tk) => (
              <TicketRow
                key={`past-${tk.idTicket}`}
                imagen={tk.imagen}
                titulo={tk.titulo}
                fecha={tk.fecha}
                direccion={tk.direccion}
                onAction={() => handleVerTicket(tk.idTicket)}
              />
            ))}
          </div>
        </div>

        {/* Ver más / Ver menos (pasados) */}
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
