import React, { useState } from 'react';
import "./CreateDiscount.css";
import { postDescuento } from '../service/DescuentoService';
import { useNavigate, useParams } from 'react-router-dom';

export const CreateDiscount = () => {
  const navigate = useNavigate();
  const { idEvento } = useParams(); 

  // estado inicial
  const [code, setCode] = useState('');
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [discountType, setDiscountType] = useState('porcentaje');
  const [discountValue, setDiscountValue] = useState('');
  const [totalLimit, setTotalLimit] = useState(100);
  const [perClientLimit, setPerClientLimit] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [massiveGeneration, setMassiveGeneration] = useState('');

  const eventIdNumber = parseInt(idEvento, 10); // para payload

  const handleGenerateCode = () => {
    const generated = 'DESC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(generated);
  };

  function generarDescuento(cod) {
    return {
      codigo: cod != null ? cod : code,
      tipoDesc: discountType === 'monto' ? 'MONTO' : 'PORCENTAJE',
      valorDescuento: parseFloat(discountValue),
      fechaInicio: startDate,
      fechaFin: endDate,
      limiteTotal: parseInt(totalLimit),
      limiteCliente: perClientLimit ? parseInt(perClientLimit) : null,
      esGlobal: false,
      activo: true,
      evento: {
        idEvento: eventIdNumber
      }
    };
  }

  function generarCodigosUnicos(cantidad) {
    const codigos = new Set();
    while (codigos.size < cantidad) {
      const nuevoCodigo =
        'DESC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      codigos.add(nuevoCodigo);
    }
    return Array.from(codigos);
  }

  const validar = () => {
    const camposObligatorios = [
      discountType,
      discountValue,
      startDate,
      endDate,
      totalLimit,
      perClientLimit,
      eventIdNumber
    ];

    const hayCamposVacios = camposObligatorios.some(
      campo => campo === '' || campo === null || campo === undefined
    );

    const codigoManualVacio =
      !autoGenerate &&
      (code || '').trim() === '' &&
      parseInt(massiveGeneration || 0) === 0;

    if (hayCamposVacios || codigoManualVacio) {
      return 'Complete todos los campos obligatorios, por favor.';
    }

    const tipoOk = ['porcentaje', 'monto'].includes(discountType);
    const valorOk =
      !isNaN(discountValue) && parseFloat(discountValue) > 0;

    const codigoOk =
      autoGenerate ||
      parseInt(massiveGeneration || 0) !== 0 ||
      (((code || '').trim().length >= 4) &&
        ((code || '').trim().length <= 20));

    const fechaInicio = new Date(startDate);
    const fechaFin = new Date(endDate);
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);

    const fechasOk = fechaFin >= fechaInicio;
    const fechasOk2 = fechaInicio >= fechaHoy;

    const limiteTotalOk =
      !isNaN(totalLimit) && parseInt(totalLimit) >= 0;
    const limiteClienteOk =
      perClientLimit === null ||
      (!isNaN(perClientLimit) && parseInt(perClientLimit) >= 0);

    const masivoOk =
      massiveGeneration === '' ||
      (!isNaN(massiveGeneration) && parseInt(massiveGeneration) >= 0);

    if (!codigoOk) return 'El código debe tener entre 4 y 20 caracteres.';
    if (!tipoOk) return 'Selecciona un tipo de descuento válido.';
    if (!valorOk) return 'Ingresa un valor de descuento positivo.';
    if (!fechasOk) return 'Las fechas de validez son inválidas o están en orden incorrecto.';
    if (!fechasOk2) return 'La fecha de inicio no puede ser anterior a hoy.';
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

    // armamos array de descuentos (soporta masivo)
    const descuentos = [];
    if (parseInt(massiveGeneration || 0) !== 0) {
      const codigos = generarCodigosUnicos(parseInt(massiveGeneration));
      for (const cod of codigos) {
        const desc = generarDescuento(cod);
        descuentos.push(desc);
      }
    } else {
      descuentos.push(generarDescuento(null));
    }

    try {
      await postDescuento(descuentos);
      alert('Descuento creado exitosamente');

      // después de crear, lo mandamos a la lista de descuentos del MISMO evento
      navigate(`/organizer/evento/${idEvento}/descuentos`);
    } catch (error) {
      alert("Hubo un error: " + error.message);
    }
  };

  const handleRegresar = () => {
    // volver a la pantalla de configuración del mismo evento
    navigate(`/organizer/evento/${idEvento}/config`);
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
                  const nuevoEstado = !autoGenerate;
                  setAutoGenerate(nuevoEstado);
                  if (nuevoEstado) {
                    handleGenerateCode();
                  } else {
                    setCode('');
                  }
                }}
              />
              Generar automáticamente
            </label>
          </div>

          <div className="campo-row">
            <div className="campo">
              <label>Tipo de descuento</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
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
                min="0"
                required
              />
            </div>
          </div>

          <div className="campo-row">
            <div className="campo">
              <label>Límite total de usos</label>
              <input
                type="number"
                value={totalLimit}
                onChange={(e) => setTotalLimit(e.target.value)}
              />
              <small className="texto-ayuda">0 = usos ilimitados</small>
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

          <div className="campo campo-masivo">
            <label>Generación masiva (opcional)</label>
            <input
              type="number"
              min="0"
              value={massiveGeneration}
              onChange={(e) => setMassiveGeneration(e.target.value)}
              placeholder="Cantidad"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="cancel"
          onClick={handleRegresar}
        >
          Regresar
        </button>

        <button
          type="button"
          className="next"
          onClick={handleSubmit}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};
