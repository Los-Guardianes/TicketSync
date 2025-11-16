import "./CardTipoEntrada.css"
import { Trash2 } from 'lucide-react';

export const CardTipoEntrada = ({
  tipoEntrada,
  index,
  tarifas,
  currentMoneda,
  onEliminarTipoEntrada
}) => {
  if (!tipoEntrada) {
    return null;
  }

  const { nombre = '', descripcion = '' } = tipoEntrada;

  // Filtrar las tarifas que corresponden a este tipo de entrada
  const tarifasDelTipo = (tarifas || []).filter(
    t => t.tipoEntrada && t.tipoEntrada.nombre === nombre
  );

  return (
    <div className="zona-card">
      <div className="zona-card-header">
        <div className="tipo-entrada-info">
          <h5 className="tipo-entrada-nombre">{nombre}</h5>
        </div>
        <button
          className="btn-action btn-eliminar"
          onClick={() => onEliminarTipoEntrada?.(index)}
          title="Eliminar tipo de entrada"
        >
          <Trash2 style={{ width: 24, height: 24 }} />
        </button>
      </div>

      <div className="zona-card-body">
        <div className="tarifas-section">
            <p className="tipo-entrada-descripcion">{descripcion}</p>
          <h6 className="tarifas-title">Tarifas</h6>
          {tarifasDelTipo.length > 0 ? (
            <div className="tarifas-list">
              {tarifasDelTipo.map((tarifa, tarifaIndex) => (
                <div key={tarifaIndex} className="tarifa-item">
                  <div className="tarifa-zona">
                    <span className="tarifa-label">Zona:</span>
                    <span className="tarifa-value">{tarifa.zona?.nombre || 'N/A'}</span>
                  </div>
                  <div className="tarifa-precio">
                    <span className="tarifa-label">Precio:</span>
                    <span className="tarifa-value"> {currentMoneda === 'SOL' ? "S/." : "$"} {tarifa.precioBase || 0}</span>
                  </div>
                  {tarifa.cantidad && (
                    <div className="tarifa-cantidad">
                      <span className="tarifa-label">Cantidad:</span>
                      <span className="tarifa-value">{tarifa.cantidad}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-tarifas">No hay tarifas asignadas</p>
          )}
        </div>
      </div>
    </div>
  );
};
