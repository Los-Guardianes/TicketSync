import React from 'react';
import { useNavigate } from 'react-router-dom';

export const OrganizerEventCard = ({
  idEvento,        // <= pásame esto desde MisEventos
  // idFuncion,       // (si lo necesitas para key)
  titulo,
  fecha,
  direccion,
  imagen,
  actionLabel = 'Configurar',
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (actionLabel.toLowerCase().includes('config')) {
      navigate(`/organizer/evento/${idEvento}/config`);
    } else {
      console.log('Ver detalle', idEvento);
    }
  };

  return (
    <div
      className="border rounded bg-light p-3 mb-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
      style={{ maxWidth: '650px' }}
    >
      <div className="d-flex">
        {/* Imagen cuadrada */}
        <div
          className="border rounded me-3"
          style={{
            width: '90px',
            height: '90px',
            backgroundColor: '#f5f5f5',
            backgroundImage: imagen ? `url(${imagen})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!imagen && (
            <span className="small text-muted d-block p-2">
              {titulo}
            </span>
          )}
        </div>

        {/* Datos del evento */}
        <div className="d-flex flex-column">
          <div className="text-muted small">{direccion}</div>
          <div className="fw-semibold" style={{ lineHeight: 1.2 }}>
            {titulo}
          </div>
          <div className="text-muted small">{fecha}</div>
        </div>
      </div>

      <div className="mt-3 mt-md-0">
        <button
          className="btn btn-outline-success btn-sm"
          onClick={handleClick}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};
