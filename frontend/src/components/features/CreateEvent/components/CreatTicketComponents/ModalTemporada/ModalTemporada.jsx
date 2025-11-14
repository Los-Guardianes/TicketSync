import "./ModalTemporada.css";
import { X } from 'lucide-react';

export const ModalTemporada = ({ 
  isOpen, 
  onClose,
  nuevaTemporada,
  setNuevaTemporada,
  handleAgregarTemporada,
  isEditMode = false
}) => {

  // SI NO ESTA ABIERTO, NO RETORNARÁ NADA
  if (!isOpen) return null;

  console.log('ModalTemporada - nuevaTemporada:', nuevaTemporada);
  console.log('ModalTemporada - isEditMode:', isEditMode);


  // SI ESTA ABIERTO
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? 'Modificar Temporada' : 'Agregar Nueva Temporada'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X style={{ width: 24, height: 24 }} />
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-form">
            <div className="modal-field">
              <label>Nombre de la Temporada</label>
              <input
                type="text"
                className="form-control"
                placeholder="Preventa, Venta General, Early Bird"
                value={nuevaTemporada.nombre}
                onChange={e => setNuevaTemporada({ ...nuevaTemporada, nombre: e.target.value })}
              />
            </div>

            <div className="row-fields">
              <div className="modal-field">
                <label>Tipo de Descuento</label>
                <select
                  className="form-control"
                  value={nuevaTemporada.tipoDesc}
                  onChange={e => setNuevaTemporada({ ...nuevaTemporada, tipoDesc: e.target.value })}
                >
                  <option value="MONTO">Monto Fijo</option>
                  <option value="PORCENTAJE">Porcentaje (%)</option>
                </select>
              </div>

              <div className="modal-field">
                <label>Valor de Descuento</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={nuevaTemporada.valorDescuento}
                  onChange={e => setNuevaTemporada({ ...nuevaTemporada, valorDescuento: Number(e.target.value) })}
                  min="0"
                />
              </div>
            </div>

            <div className="row-fields">
              <div className="modal-field">
                <label>Fecha de Inicio</label>
                <input
                  type="date"
                  className="form-control"
                  value={nuevaTemporada.fechaInicio}
                  onChange={e => setNuevaTemporada({ ...nuevaTemporada, fechaInicio: e.target.value })}
                />
              </div>

              <div className="modal-field">
                <label>Fecha de Fin</label>
                <input
                  type="date"
                  className="form-control"
                  value={nuevaTemporada.fechaFin}
                  onChange={e => setNuevaTemporada({ ...nuevaTemporada, fechaFin: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => onClose()}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleAgregarTemporada}>
                {isEditMode ? 'Actualizar Temporada' : 'Agregar Temporada'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};