import React from 'react';
import './OrganizerEventCard.css';
import { useNavigate } from 'react-router-dom';

export const OrganizerEventCard = ({ id, titulo, fecha, direccion, imagen, actionLabel = 'Configurar' }) => {
  const navigate = useNavigate();

  const openConfig = () => {
    navigate('/create-event', { state: { from: 'organizer', idEvento: id } });
  };

  return (
    <div className="org-card d-flex gap-3 align-items-center p-3 border rounded mb-3">
      <div className="org-card__thumb bg-light rounded overflow-hidden">
        <img src={imagen || '/placeholder.png'} alt={titulo} />
      </div>
      <div className="flex-grow-1">
        <div className="small text-muted">{direccion}</div>
        <h6 className="mb-1">{titulo}</h6>
        <div className="small">{fecha || 'Sin fecha definida'}</div>
      </div>
      <button className="btn btn-outline-success ms-auto" onClick={openConfig}>
        {actionLabel}
      </button>
    </div>
  );
};
