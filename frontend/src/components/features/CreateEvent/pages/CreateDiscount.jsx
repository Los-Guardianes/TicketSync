import React, { useState } from 'react';
import "./CreateEvent.css";

export const CreateDiscount = () => {
  const [code, setCode] = useState('');
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [discountType, setDiscountType] = useState('porcentaje');
  const [discountValue, setDiscountValue] = useState('');
  const [ticketTypes, setTicketTypes] = useState('');
  const [totalLimit, setTotalLimit] = useState(100);
  const [perClientLimit, setPerClientLimit] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [massiveGeneration, setMassiveGeneration] = useState(false);

  const handleGenerateCode = () => {
    const generated = 'DESC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(generated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      code,
      discountType,
      discountValue,
      ticketTypes,
      totalLimit,
      perClientLimit,
      startDate,
      endDate,
      massiveGeneration,
    };
    console.log('Descuento guardado:', payload);
  };

  return (
    <form className="crear-evento-container evento-form" onSubmit={handleSubmit}>
      <div className="header">
        <span className="step">4</span>
        <h2>Crear Descuentos</h2>
      </div>
      <div className="form-content">
        <div className="form-left">
          <div className="campo">
            <label>Código</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={autoGenerate}
            />
            <label>
              <input
                type="checkbox"
                checked={autoGenerate}
                onChange={() => {
                  setAutoGenerate(!autoGenerate);
                  if (!autoGenerate) handleGenerateCode();
                }}
              />
              Generar automáticamente
            </label>
          </div>

          <div className="campo">
            <label>Tipo de descuento</label>
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="monto">Monto fijo (S/)</option>
            </select>
          </div>

          <div className="campo">
            <label>Valor de descuento</label>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label>Aplica a tipos de entradas</label>
            <input
              type="text"
              value={ticketTypes}
              onChange={(e) => setTicketTypes(e.target.value)}
              placeholder="Ej. VIP, General"
            />
          </div>

          <div className="campo">
            <label>Límite total de usos</label>
            <input
              type="number"
              value={totalLimit}
              onChange={(e) => setTotalLimit(e.target.value)}
            />
          </div>

          <div className="campo">
            <label>Límite por cliente</label>
            <input
              type="number"
              value={perClientLimit}
              onChange={(e) => setPerClientLimit(e.target.value)}
            />
          </div>
        </div>

        <div className="form-right">
          <div className="fechas">
            <div className="fecha-hora">
              <label>Inicio validez</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="fecha-hora">
              <label>Fin validez</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="campo">
            <label>
              <input
                type="checkbox"
                checked={massiveGeneration}
                onChange={() => setMassiveGeneration(!massiveGeneration)}
              />
              Generación masiva (opcional)
            </label>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel" onClick={() => navigate("/ubicacion-evento")}>Regresar</button>
        <button type="submit" className="next">
          Guardar
        </button>
      </div>
    </form>
  );
};