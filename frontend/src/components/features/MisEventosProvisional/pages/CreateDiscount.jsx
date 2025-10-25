import React, { useState } from 'react';
import "./CreateDiscount.css";
import { postDescuento } from '../service/DescuentoService';
import { useNavigate } from 'react-router-dom';

export const CreateDiscount = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [discountType, setDiscountType] = useState('porcentaje');
  const [discountValue, setDiscountValue] = useState('');
  const [idEvent, setIdEvent] = useState(0);
  const [totalLimit, setTotalLimit] = useState(100);
  const [perClientLimit, setPerClientLimit] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [massiveGeneration, setMassiveGeneration] = useState(0);

  const handleGenerateCode = () => {
    const generated = 'DESC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(generated);
  };

    const validar = () => {
    const tipoOk = ['porcentaje', 'monto'].includes(discountType);
    const valorOk = !isNaN(discountValue) && parseFloat(discountValue) > 0;
    const codigoOk = autoGenerate || ((code || '').trim().length >= 4 && (code || '').trim().length <= 20);

    const fechaInicio = new Date(startDate);
    const fechaFin = new Date(endDate);
    const fechasOk = startDate && endDate && fechaFin >= fechaInicio;

    const limiteTotalOk = !isNaN(totalLimit) && parseInt(totalLimit) >= 0;
    const limiteClienteOk = perClientLimit === null || (!isNaN(perClientLimit) && parseInt(perClientLimit) >= 0);
    const masivoOk = massiveGeneration === '' || (!isNaN(massiveGeneration) && parseInt(massiveGeneration) >= 0);

    if (!codigoOk) return 'El código debe tener entre 4 y 20 caracteres.';
    if (!tipoOk) return 'Selecciona un tipo de descuento válido.';
    if (!valorOk) return 'Ingresa un valor de descuento positivo.';
    if (!fechasOk) return 'Las fechas de validez son inválidas o están en orden incorrecto.';
    if (!limiteTotalOk) return 'El límite total debe ser un número mayor o igual a 0.';
    if (!limiteClienteOk) return 'El límite por cliente debe ser un número mayor o igual a 0 o nulo.';
    if (!masivoOk) return 'La cantidad de generación masiva debe ser un número positivo o vacío.';

    return null;
  };

  const handleSubmit = async () => {

    const error = validar();
        if (error) {
            alert(error);
            return;
        }
    const descuento = {
      codigo: code,
      tipoDesc: discountType === 'MONTO' ? "MONTO" : "PORCENTAJE",
      valorDescuento: parseFloat(discountValue),
      fechaInicio: startDate,
      fechaFin: endDate,
      limiteTotal: parseInt(totalLimit),
      limiteCliente: perClientLimit ? parseInt(perClientLimit) : null,
      esGlobal: false,
      activo: true,
      evento: {
        idEvento: idEvent
      }
    };

    try {
      await postDescuento(descuento);
      alert('Descuento creado exitosamente');
      navigate('/home');
    } catch (error) {
      alert("Hubo un error: " + error.message);
    }
  };

  return (
    <div className="crear-evento-container evento-form">
      <div className="header">
        <span className="step"><i className="fa-solid fa-gears"></i></span>
        <h2>Crear Descuentos</h2>
      </div>

      <div className="form-content">
        <div className="form-left">
          <div className="campo">
            <label>Código</label>
            <input
              type="text"
              maxLength="20"
              placeholder="Ingresa una cadena de 4 a 20 caracteres"
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

          <div className="campo-row">
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
                min="0"
              />
            </div>
          </div>

          <div className="campo">
            <label>Id Evento</label> {/* esto se quitará cuando se integre con las demás páginas */}
            <input
              type="text"
              value={idEvent}
              onChange={(e) => setIdEvent(e.target.value)}
              placeholder="Selecciona la ID de evento"
            />
          </div>

          <div className="campo-row">
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

          <p>0 = usos ilimitados</p>

          <div className="campo campo-masivo">
            <label>Generación masiva (opcional)</label>
            <input
              type="number"
              value={massiveGeneration}
              onChange={(e) => setMassiveGeneration(e.target.value)}
              min="0"
              placeholder="Cantidad"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel" onClick={() => navigate("/dsctosxevento")}>
          Regresar
        </button>
        <button type="button" className="next" onClick={handleSubmit}>
          Guardar
        </button>
      </div>
    </div>
  );
};