import React, { useEffect, useMemo, useState } from 'react';
import './MisEventos.css';
import { OrganizerEventCard } from '../components/OrganizerEventCard';
import { getEventosByOrganizer } from '../../../../globalServices/EventoService';
import { useAuth } from '../../../../context/AuthContext';
import { BarraLateral } from '../../MisTickets/components/BarraLateral';
import { applyFiltersToEvents } from '../components/ApplyFilters';
import { FiltersSection } from '../components/Filters';

// Configura cuántas cards visibles por sección antes de mostrar "Ver más"/paginación
const PAGE_SIZE = 6;

const buildEventCards = (eventos) => {
  // Si viene null/undefined/cualquier cosa rara, lo convertimos en []
  if (!Array.isArray(eventos)) {
    return { upcoming: [], past: [] };
  }
  // console.log(eventos);
  const actuales = [];
  const pasados = [];
  eventos.forEach((ev) => {
    const card = {
      idEvento: ev.idEvento,
      titulo: ev.nombre,
      direccion: ev.direccion,
      imagen: ev.urlImagen,
      fecha: ev.fechaReferencia,
      categoria: ev.categoriaEvento,
      dpto: ev.ciudad,
    };
    if (ev?.esPasado) {
      pasados.push(card);
    } else {
      actuales.push(card);
    }
  });
  return { actuales, pasados };
};


// Hook reutilizable de paginación
const usePagination = (items, pageSize, showAll) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // si cambian los items y la página actual ya no existe, resetea
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [items, totalPages]);

  const visible = showAll ? items : items.slice((page - 1) * pageSize, page * pageSize);
  const showPager = !showAll && items.length > pageSize;

  return { visible, page, setPage, totalPages, showPager };
};

export const MisEventos = () => {
  const { user } = useAuth();

  const [filters, setFilters] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventos, setEventos] = useState([]);
  
  const [showAllActuales, setShowAllActuales] = useState(false);
  const [showAllPasados, setShowAllPasados] = useState(false);

  // Cargamos eventos del organizador
  useEffect(() => {
    const load = async () => {
      try {
        if (!user?.idUsuario) return; // protección: no intentes llamar aún
        const data = await getEventosByOrganizer(user.idUsuario);
        // setEventos(Array.isArray(data) ? data : []);
        console.log(data)
        const eventosArray = Array.isArray(data) ? data : [];
        // Aplica los filtros si existen
        const eventosFiltrados = applyFiltersToEvents(eventosArray, filters);
        setEventos(eventosFiltrados);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar tus eventos.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.idUsuario, filters]);

  // Construimos listas de funciones próximas y pasadas
  // A nivel de eventos
  const { actuales, pasados } = useMemo(() => buildEventCards(eventos), [eventos]);


  // Paginación para ambos bloques
  const actualesPag = usePagination(actuales || [], PAGE_SIZE, showAllActuales);
  const pasadosPag = usePagination(pasados || [], PAGE_SIZE, showAllPasados);

  const handleApplyFilters = (f) => {
    setFilters(f);
  }

  // Estados de carga / error
  if (loading) {
    return (
      <div className="d-flex">
        <BarraLateral />
        <main className="flex-grow-1 p-4">
          <h3 className="mb-3">Mis Eventos</h3>
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
          <h3 className="mb-3">Mis Eventos</h3>
          <p className="text-danger">{error}</p>
        </main>
      </div>
    );
  }

  // Render normal
  return (
    <div className="d-flex">
      {/* Barra lateral reutilizable */}
      <BarraLateral />

      {/* Contenido principal */}
      <main className="flex-grow-1 p-4">
        <FiltersSection onApply={handleApplyFilters} />
        <h3 className="mb-3">Mis Eventos</h3>

        {/* Eventos próximos */}
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            {/* {upcoming.length === 0 && ( */}
            {actuales.length === 0 && (
              <p className="text-muted">No tienes eventos próximos.</p>
            )}
            {actualesPag.visible.map((it) => (
              <OrganizerEventCard
                key={`${it.idEvento}`}
                idEvento={it.idEvento}
                titulo={it.titulo}
                fecha={it.fecha}
                direccion={it.direccion}
                imagen={it.imagen}
                actionLabel="Configurar"
              />
            ))}
          </div>
          
          <div className="col-12 col-lg-6">
            {/* segunda columna opcional */}
          </div>
        </div>

        {/* Botón Ver más / Ver menos (próximos) */}
        {actuales.length > PAGE_SIZE && (
          <div className="d-flex align-items-center mt-3">
            <button
              className="btn btn-link p-0"
              onClick={() => setShowAllActuales((s) => !s)}
            >
              {showAllActuales ? 'Ver menos' : 'Ver más'}
            </button>
            <span
              className="ms-2 triangle-down"
              style={{
                transform: showAllActuales ? 'rotate(180deg)' : 'none',
              }}
            />
          </div>
        )}

        {/* Paginación próximos (solo si no estamos en modo "ver todo") */}
        {!showAllActuales && actualesPag.showPager && (
          <div className="pagination-like d-flex gap-3 justify-content-center my-4">
            <button
              className="btn btn-sm btn-light"
              // disabled={upcomingPag.page === 1}
              disabled={actualesPag.page === 1}
              onClick={() =>
                // upcomingPag.setPage((p) => Math.max(1, p - 1))
                actualesPag.setPage((p) => Math.max(1, p - 1))
              }
            >
              &lt;
            </button>

            {Array.from(
              { length: actualesPag.totalPages },
              (_, i) => i + 1
            ).map((n) => (
              <button
                key={n}
                className={`btn btn-sm ${
                  actualesPag.page === n ? 'btn-success' : 'btn-light'
                }`}
                onClick={() => actualesPag.setPage(n)}
              >
                {n}
              </button>
            ))}

            <button
              className="btn btn-sm btn-light"
              disabled={actualesPag.page === actualesPag.totalPages}
              onClick={() =>
                actualesPag.setPage((p) =>
                  Math.min(actualesPag.totalPages, p + 1)
                )
              }
            >
              &gt;
            </button>
          </div>
        )}

        {/* Eventos pasados */}
        <h4 className="mt-4">Eventos Pasados</h4>

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            {pasados.length === 0 && (
              <p className="text-muted">Sin eventos pasados.</p>
            )}
            {pasadosPag.visible.map((it) => (
              <OrganizerEventCard
                key={`${it.idEvento}`}
                idEvento={it.idEvento}
                titulo={it.titulo}
                fecha={it.fecha}
                direccion={it.direccion}
                imagen={it.imagen}
                actionLabel="Configurar"
              />
            ))}
          </div>
        </div>

        {/* Botón Ver más / Ver menos (pasados) */}
        {pasados.length > PAGE_SIZE && (
          <div className="d-flex align-items-center mt-3">
            <button
              className="btn btn-link p-0"
              onClick={() => setShowAllPasados((s) => !s)}
            >
              {showAllPasados ? 'Ver menos' : 'Ver más'}
            </button>
            <span
              className="ms-2 triangle-down"
              style={{
                transform: showAllPasados ? 'rotate(180deg)' : 'none',
              }}
            />
          </div>
        )}

        {/* Paginación pasados (solo si no estamos en modo "ver todo") */}
        {!showAllPasados && pasadosPag.showPager && (
          <div className="pagination-like d-flex gap-3 justify-content-center my-4">
            <button
              className="btn btn-sm btn-light"
              disabled={pasadosPag.page === 1}
              onClick={() =>
                pasadosPag.setPage((p) => Math.max(1, p - 1))
              }
            >
              &lt;
            </button>

            {Array.from(
              { length: pasadosPag.totalPages },
              (_, i) => i + 1
            ).map((n) => (
              <button
                key={n}
                className={`btn btn-sm ${
                  pasadosPag.page === n ? 'btn-success' : 'btn-light'
                }`}
                onClick={() => pasadosPag.setPage(n)}
              >
                {n}
              </button>
            ))}

            <button
              className="btn btn-sm btn-light"
              disabled={pasadosPag.page === pasadosPag.totalPages}
              onClick={() =>
                pasadosPag.setPage((p) =>
                  Math.min(pasadosPag.totalPages, p + 1)
                )
              }
            >
              &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
