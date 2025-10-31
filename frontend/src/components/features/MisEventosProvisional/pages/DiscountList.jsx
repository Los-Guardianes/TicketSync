import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDescuentosActivosByEvento } from '../service/DescuentoService';
import './CreateDiscount.css'; 

export const DiscountList = () => {
  const navigate = useNavigate();
  const { idEvento } = useParams();

  const [descuentos, setDescuentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cargaError, setCargaError] = useState(false);

  useEffect(() => {
    const fetchDescuentos = async () => {
      try {
        const data = await getDescuentosActivosByEvento(idEvento);
        setDescuentos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al obtener descuentos activos:', err);
        setCargaError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDescuentos();
  }, [idEvento]);

  const handleRegresar = () => {
    navigate(`/organizer/evento/${idEvento}/config`);
  };

  const handleEditar = (idDescuento) => {
    console.log('Editar descuento', idDescuento);
    // futuro: navigate(`/organizer/evento/${idEvento}/descuentos/${idDescuento}/edit`)
  };

  const handleEliminar = (idDescuento) => {
    console.log('Eliminar descuento', idDescuento);
    // futuro: confirm() y DELETE al backend
  };

  return (
    <div className="crear-evento-container">
      <div className="header">
        <h2>Gestión de descuentos</h2>
      </div>

      {loading && (
        <p className="text-muted" style={{ marginBottom: '1rem' }}>
          Cargando...
        </p>
      )}

      {cargaError && !loading && (
        <p className="text-danger" style={{ marginBottom: '1rem' }}>
          No se pudieron cargar los descuentos activos de este evento.
        </p>
      )}

      {!loading && !cargaError && (
        <div className="campo">
          <label
            style={{
              fontWeight: '600',
              marginBottom: '12px',
              display: 'block',
            }}
          >
            Descuentos activos
          </label>

          {descuentos.length === 0 ? (
            <p className="text-muted">
              Este evento no tiene descuentos activos.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    background: '#eaf6ea',
                    textAlign: 'left',
                  }}
                >
                  <th style={{ padding: '12px' }}>Código</th>
                  <th style={{ padding: '12px' }}>Tipo</th>
                  <th style={{ padding: '12px' }}>Valor</th>
                  <th style={{ padding: '12px' }}>Límite total</th>
                  <th style={{ padding: '12px' }}>Límite por cliente</th>
                  <th style={{ padding: '12px' }}>Vigencia</th>
                  <th style={{ padding: '12px' }}>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {descuentos.map((d, idx) => {
                  // Campos esperados desde el backend (DTO):
                  // d.idDescuento
                  // d.codigo
                  // d.tipoDesc -> "PORCENTAJE" | "MONTO"
                  // d.valorDescuento
                  // d.limiteTotal
                  // d.limiteCliente
                  // d.fechaInicio (string)
                  // d.fechaFin (string)
                  // d.activo (true/false) <-- siempre true en esta lista

                  const tipoLabel =
                    d.tipoDesc === 'MONTO'
                      ? 'Monto'
                      : 'Porcentaje';

                  const valorLabel =
                    d.tipoDesc === 'MONTO'
                      ? `S/ ${d.valorDescuento}`
                      : `${d.valorDescuento}%`;

                  const vigenciaLabel = `${d.fechaInicio} → ${d.fechaFin}`;

                  return (
                    <tr
                      key={d.idDescuento ?? idx}
                      style={{ borderBottom: '1px solid #ddd' }}
                    >
                      <td style={{ padding: '12px' }}>{d.codigo}</td>

                      <td style={{ padding: '12px' }}>{tipoLabel}</td>

                      <td style={{ padding: '12px' }}>{valorLabel}</td>

                      <td style={{ padding: '12px' }}>
                        {d.limiteTotal === 0
                          ? 'Ilimitado'
                          : d.limiteTotal}
                      </td>

                      <td style={{ padding: '12px' }}>
                        {d.limiteCliente === null
                          ? 'Sin límite'
                          : d.limiteCliente}
                      </td>

                      <td style={{ padding: '12px' }}>
                        {vigenciaLabel}
                      </td>

                      <td style={{ padding: '12px' }}>
                        <button
                          style={{
                            marginRight: '8px',
                            background: 'none',
                            border: 'none',
                            color: '#219653',
                            cursor: 'pointer',
                          }}
                          onClick={() =>
                            handleEditar(d.idDescuento)
                          }
                        >
                          ✏️
                        </button>

                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#d32f2f',
                            cursor: 'pointer',
                          }}
                          onClick={() =>
                            handleEliminar(d.idDescuento)
                          }
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="form-actions">
        <button
          className="cancel"
          type="button"
          onClick={handleRegresar}
        >
          Regresar
        </button>

        <button
          className="next"
          type="button"
          onClick={() =>
            navigate(`/organizer/evento/${idEvento}/descuentos/nuevo`)
          }
        >
          Crear nuevo descuento
        </button>
      </div>
    </div>
  );
};
