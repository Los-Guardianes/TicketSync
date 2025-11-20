import React from 'react';
import { Plus } from 'lucide-react';
import "./EntradasSection.css";

import { CardTipoEntrada } from '../CardTipoEntrada/CardTipoEntrada';

export const EntradasSection = ({
  eventData,
  eliminarTipoEntrada,
  currentMoneda,
  onAbrirModalTipoEntrada
}) => {
  return (
    <div className="container-frame">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="section-title">Tipo de Entrada</h4>
        <button 
          className="btn-primary"
          onClick={onAbrirModalTipoEntrada}
        >
          <Plus style={{ width: 24, height: 24 }}/>
        </button>
      </div>
      <div className='tipoDeEntrada-list'>
        {eventData.zonas.length > 0 ? (
          <div className='entradas-grid'>
            {eventData.tiposDeEntrada.length > 0 ? (
              eventData.tiposDeEntrada.map((tipoEntrada, index) => (
                <CardTipoEntrada
                  key={index}
                  tipoEntrada={tipoEntrada}
                  index={index}
                  tarifas={eventData.tarifas}
                  currentMoneda={currentMoneda}
                  onEliminarTipoEntrada={eliminarTipoEntrada}
                  zonas={eventData.zonas} // ✅ Pasar zonas
                />
              ))
            ) : (
              <div className="empty-state">
                <p className="mb-0">
                  No hay tipos de entradas creadas. Haz clic en "+" para comenzar.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p className="mb-0">No hay zonas disponibles. Crea zonas primero en la sección anterior.</p>
          </div>
        )}
      </div>
    </div>
  );
};