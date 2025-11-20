import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import "./ZonasSection.css"; // Opcional: puedes crear estilos específicos

export const ZonasSection = ({ 
  eventData, 
  onAbrirModalZona, 
  onEliminarZona 
}) => {
  return (
    <div className="container-frame">
      <div className="zonas-header">
        <h4 className="section-title">Zonas del Evento</h4>
        <button className="btn-primary" onClick={onAbrirModalZona}>
          <Plus style={{ width: 24, height: 24 }}/>
        </button>
      </div>
      <div className="zonas-grid">
        {eventData.zonas && eventData.zonas.length > 0 ? (
          eventData.zonas.map((zona, index) => (
            <div key={index} className="zona-card">
              <div className="zona-card-header">
                <span className="zona-number">{zona.nombre}</span>
                <button
                  className="btn-action btn-eliminar"
                  onClick={() => onEliminarZona(index)}
                  title="Eliminar zona"
                >
                  <Trash2 style={{ width: 24, height: 24 }}/>
                </button>
              </div>
              <div className="zona-card-body">
                <div className="zona-info">
                  <span className="zona-label">Aforo:</span>
                  <span className="zona-value">{zona.aforo}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No hay zonas creadas. Haz clic en "{<Plus style={{ width: 24, height: 24 }}/>}" para comenzar.</p>
          </div>
        )}
      </div>
    </div>
  );
};