import React from 'react';
import { Plus } from 'lucide-react';
import { CardTemporada } from '../CardTemporada/CardTemporada';
import "./TemporadasSection.css";

export const TemporadasSection = ({
  eventData,
  temporadaActual,
  onEliminarTemporada,
  onSeleccionarTemporada,
  onAbrirModalTemporada
}) => {

  const temporadas = eventData.temporadas || [];

  return (
    <div className="container-frame">
      <div className="temporadas-header">
        <h4 className="section-title">Temporadas del Evento</h4>
        <button className="btn-primary" onClick={() => onAbrirModalTemporada()}>
          <Plus style={{ width: 24, height: 24 }}/>
        </button>
      </div>

      {console.log("TemporadasSection - temporadas:", temporadas)}

      <div className="temporadas-list">
        {temporadas.length > 0 ? (
          temporadas.map((temporada, index) => (
            <CardTemporada
              key={index}
              temporada={temporada}
              isSelected={index === temporadaActual}
              onSeleccionar={() => onSeleccionarTemporada(index)}
              onModificar={() => onAbrirModalTemporada(index)}
              onEliminar={() => onEliminarTemporada(index)}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>No hay temporadas creadas. Haz clic en "{<Plus style={{ width: 24, height: 24 }}/>}" para comenzar.</p>
          </div>
        )}
      </div>
    </div>
  );
};