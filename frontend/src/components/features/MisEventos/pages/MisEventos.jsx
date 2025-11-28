"use client"

import { useEffect, useMemo, useState } from "react"
import "./MisEventos.css"
import { OrganizerEventCard } from "../components/OrganizerEventCard"
import { getEventosByOrganizer } from "../../../../globalServices/EventoService"
import { useAuth } from "../../../../context/AuthContext"
import { applyFiltersToEvents } from "../components/ApplyFilters"
import { FiltersSection } from "../components/Filters"

const PAGE_SIZE = 6

const buildEventCards = (eventos) => {
  if (!Array.isArray(eventos)) {
    return { actuales: [], pasados: [] }
  }
  const actuales = []
  const pasados = []
  
  eventos.forEach((ev) => {
    const card = {
      idEvento: ev.idEvento,
      titulo: ev.nombre,
      direccion: ev.direccion,
      imagen: ev.urlImagen,
      fecha: ev.fechaReferencia,
      fechaFin: ev.fechaFin,
      categoria: ev.categoriaEvento,
      activo: ev.activo,
      dpto: ev.ciudad,
    }
    // Asumimos que el backend envía una bandera o calculamos si es pasado
    if (ev?.esPasado) {
      pasados.push(card)
    } else {
      actuales.push(card)
    }
  })
  return { actuales, pasados }
}

const usePagination = (items, pageSize, showAll) => {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [items, totalPages])

  const visible = showAll ? items : items.slice((page - 1) * pageSize, page * pageSize)
  const showPager = !showAll && items.length > pageSize

  return { visible, page, setPage, totalPages, showPager }
}

export const MisEventos = () => {
  const { user } = useAuth()
  const [filters, setFilters] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [eventos, setEventos] = useState([])
  const [showAllActuales, setShowAllActuales] = useState(false)
  const [showAllPasados, setShowAllPasados] = useState(false)

  // Carga de datos limpia (versión develop3)
  useEffect(() => {
    const load = async () => {
      try {
        if (!user?.idUsuario) return
        const data = await getEventosByOrganizer(user.idUsuario)
        console.log("Eventos organizador:", data)
        const eventosArray = Array.isArray(data) ? data : []
        const eventosFiltrados = applyFiltersToEvents(eventosArray, filters)
        setEventos(eventosFiltrados)
      } catch (err) {
        console.error(err)
        setError("No se pudieron cargar tus eventos.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user?.idUsuario, filters])

  const { actuales, pasados } = useMemo(() => buildEventCards(eventos), [eventos])

  const actualesPag = usePagination(actuales || [], PAGE_SIZE, showAllActuales)
  const pasadosPag = usePagination(pasados || [], PAGE_SIZE, showAllPasados)

  const handleApplyFilters = (f) => {
    setFilters(f)
  }

  const EmptyState = ({ message }) => (
    <div className="empty-state">
      <div className="empty-state__content">
        <div className="empty-state__image-container">
          <img src="/src/assets/TuTicket_Sin_Palabras.png" alt="Eventos" className="empty-state__image" />
          <div className="empty-state__gradient"></div>
        </div>
        <p className="empty-state__message">{message}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="mis-eventos-container">
        <div className="mis-eventos-wrapper">
          <div className="mis-eventos-header__content">
            <h1 className="mis-eventos-header__title">Mis Eventos</h1>
          </div>
          <EmptyState message="Cargando tus eventos..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mis-eventos-container">
        <div className="mis-eventos-wrapper">
          <div className="mis-eventos-header__content">
            <h1 className="mis-eventos-header__title">Mis Eventos</h1>
          </div>
          <p className="error-message">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mis-eventos-container">
      <div className="mis-eventos-wrapper">
        <div className="mis-eventos-header__content">
          <h1 className="mis-eventos-header__title">Mis Eventos</h1>
        </div>

        <FiltersSection onApply={handleApplyFilters} />

        {/* SECCIÓN ACTUALES */}
        <div className="eventos-section eventos-section--upcoming">
          <div className="eventos-section__header">
            <div className="eventos-section__title-content">
              <h2 className="eventos-section__title">Próximos Eventos</h2>
              <p className="eventos-section__description">Eventos activos y por venir</p>
            </div>
            {actuales.length > 0 && (
              <div className="eventos-section__count">
                {actuales.length} evento{actuales.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {actuales.length === 0 ? (
            <EmptyState message="No tienes eventos próximos." />
          ) : (
            <>
              <div className="eventos-grid">
                {actualesPag.visible.map((it) => (
                  <OrganizerEventCard
                    key={`${it.idEvento}`}
                    idEvento={it.idEvento}
                    titulo={it.titulo}
                    fecha={it.fecha}
                    fechaFin={it.fechaFin}
                    direccion={it.direccion}
                    imagen={it.imagen}
                    actionLabel="Configurar"
                  />
                ))}
              </div>

              {actuales.length > PAGE_SIZE && (
                <div className="toggle-more">
                  <button className="toggle-button" onClick={() => setShowAllActuales((s) => !s)}>
                    {showAllActuales ? "▼ Ver menos" : "▶ Ver más eventos"}
                  </button>
                </div>
              )}

              {!showAllActuales && actualesPag.showPager && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    disabled={actualesPag.page === 1}
                    onClick={() => actualesPag.setPage((p) => Math.max(1, p - 1))}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: actualesPag.totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={`pagination-button ${actualesPag.page === n ? "active" : ""}`}
                      onClick={() => actualesPag.setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="pagination-button"
                    disabled={actualesPag.page === actualesPag.totalPages}
                    onClick={() => actualesPag.setPage((p) => Math.min(actualesPag.totalPages, p + 1))}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* SECCIÓN PASADOS */}
        <div className="eventos-section eventos-section--past">
          <div className="eventos-section__header">
            <div className="eventos-section__title-content">
              <h2 className="eventos-section__title">Eventos Finalizados</h2>
              <p className="eventos-section__description">Tu historial de eventos organizados</p>
            </div>
            {pasados.length > 0 && (
              <div className="eventos-section__count">
                {pasados.length} evento{pasados.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {pasados.length === 0 ? (
            <EmptyState message="Sin eventos finalizados." />
          ) : (
            <>
              <div className="eventos-grid">
                {pasadosPag.visible.map((it) => (
                  <OrganizerEventCard
                    key={`${it.idEvento}`}
                    idEvento={it.idEvento}
                    titulo={it.titulo}
                    fecha={it.fecha}
                    direccion={it.direccion}
                    imagen={it.imagen}
                    actionLabel="Configurar"
                    esPasado={true} 
                  />
                ))}
              </div>

              {pasados.length > PAGE_SIZE && (
                <div className="toggle-more">
                  <button className="toggle-button" onClick={() => setShowAllPasados((s) => !s)}>
                    {showAllPasados ? "▼ Ver menos" : "▶ Ver más eventos"}
                  </button>
                </div>
              )}

              {!showAllPasados && pasadosPag.showPager && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    disabled={pasadosPag.page === 1}
                    onClick={() => pasadosPag.setPage((p) => Math.max(1, p - 1))}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: pasadosPag.totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={`pagination-button ${pasadosPag.page === n ? "active" : ""}`}
                      onClick={() => pasadosPag.setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="pagination-button"
                    disabled={pasadosPag.page === pasadosPag.totalPages}
                    onClick={() => pasadosPag.setPage((p) => Math.min(pasadosPag.totalPages, p + 1))}
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
  )
}