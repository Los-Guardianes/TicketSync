import React from 'react';
import "./ConfigGeneral.css"; // Opcional: puedes crear estilos específicos

export const ConfigGeneral = ({ 
  currentMoneda, 
  handleMonedaChange, 
  maxComprasTicket, 
  handleMaxComprasChange 
}) => {
  return (
    <div className="configuracion-general">

      <div className="container-frame">
        <h4 className="section-title">Configuración General</h4>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label htmlFor="moneda">Moneda</label>
            <select
              id="moneda"
              className="form-control"
              value={currentMoneda}
              onChange={handleMonedaChange}
            >
              <option value="SOL">S/ (SOL)</option>
              <option value="DOLAR">$ (DOLAR)</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="maxCompras">Máximo de compras por ticket</label>
            <input
              type="number"
              id="maxCompras"
              className="form-control"
              value={maxComprasTicket || 4}
              onChange={handleMaxComprasChange}
              min="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};