// src/components/pages/MisEventos/MisEventos.jsx
import React, { useState } from 'react';
import Sidebar from '../../common/Sidebar/Sidebar';
import './MisEventos.css';

export const MisEventos = () => {
  const sampleUpcoming = [
    {
      id: 1,
      title: 'SMASHING PUMPKINGS - THE WORLD IS A VAM...',
      date: '01 de Enero de 2025',
      venue: 'Av. Sample 3043',
    },
    { id: 2, title: 'sampleTitle', date: '01 de Enero de 2025', venue: 'Av. Sample 3043' },
    { id: 3, title: 'sampleTitle', date: '01 de Enero de 2025', venue: 'Av. Sample 3043' },
    { id: 4, title: 'sampleTitle', date: '01 de Enero de 2025', venue: 'Av. Sample 3043' },
  ];

  const samplePast = [
    { id: 11, title: 'sampleTitle', date: '01 de Enero de 2025', venue: 'Av. Sample 3043' },
    { id: 12, title: 'sampleTitle', date: '01 de Enero de 2025', venue: 'Av. Sample 3043' },
    { id: 13, title: 'sampleTitle', date: '01 de Enero de 2025', venue: 'Av. Sample 3043' },
    { id: 14, title: 'sampleTitle', date: '01 de Enero de 2025', venue: 'Av. Sample 3043' },
  ];

  const [upcoming] = useState(sampleUpcoming);
  const [past] = useState(samplePast);
  const [currentPage, setCurrentPage] = useState(1);

  const handleConfigure = (id) => {
    // reemplaza por navegación o abrir modal
    console.log('Configurar evento', id);
  };

  const handleViewDetail = (id) => {
    // reemplaza por navegación a detalle
    console.log('Ver detalle evento', id);
  };

  const goToPage = (p) => setCurrentPage(p);

  return (
    <div className="d-flex">
      <Sidebar />

      <main className="mis-eventos-content flex-grow-1 p-4">
        <section className="section-upcoming">
          <h1 className="page-title">Mis Eventos</h1>

          <div className="events-grid">
            {upcoming.map((ev) => (
              <article key={ev.id} className="event-card">
                <div className="thumb" aria-hidden />
                <div className="event-info">
                  <h3 className="event-title">{ev.title}</h3>
                  <div className="event-meta">
                    <span className="event-date">{ev.date}</span>
                    <span className="event-venue">{ev.venue}</span>
                  </div>
                </div>

                <div className="event-action">
                  <button className="btn-config" onClick={() => handleConfigure(ev.id)}>
                    Configurar
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="ver-mas">Ver más ▾</div>
        </section>

        <section className="section-past">
          <h2 className="section-title">Eventos Pasados</h2>

          <div className="past-grid">
            {past.map((ev) => (
              <article key={ev.id} className="past-card">
                <div className="past-thumb" aria-hidden />
                <div className="past-info">
                  <h4 className="past-title">{ev.title}</h4>
                  <div className="past-meta">
                    <span>{ev.date}</span>
                    <span>{ev.venue}</span>
                  </div>
                </div>

                <div className="past-action">
                  <button className="btn-detail" onClick={() => handleViewDetail(ev.id)}>
                    Ver Detalle
                  </button>
                </div>
              </article>
            ))}
          </div>

          <nav className="pagination">
            <button onClick={() => goToPage(Math.max(1, currentPage - 1))} aria-label="prev">
              ‹
            </button>
            {[1, 2, 3, 4].map((p) => (
              <button key={p} className={p === currentPage ? 'active' : ''} onClick={() => goToPage(p)}>
                {p}
              </button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} aria-label="next">
              ›
            </button>
          </nav>
        </section>
      </main>
    </div>
  );
};

export default MisEventos;
