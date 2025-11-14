import "./ModalZona.css";
import { X } from 'lucide-react';

export const ModalZona = ({ 
  isOpen, 
  onClose, 
  nuevaZona, 
  setNuevaZona, 
  handleAgregarZona
}) => {
  // SI NO ESTA ABIERTO, NO RETORNARÁ NADA
  if (!isOpen) return null;
  
  // SI ESTA ABIERTO
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Agregar Nueva Zona</h3>
          <button className="modal-close" onClick={onClose}>
            <X style={{ width: 24, height: 24 }} />
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-form">
            <div className="modal-field">
              <label>Nombre de la Zona</label>
              <input
                type="text"
                className="form-control"
                placeholder="VIP, Platea, General"
                value={nuevaZona.nombre}
                onChange={e => setNuevaZona({ ...nuevaZona, nombre: e.target.value })}
              />
            </div>
            <div className="modal-field">
              <label>Aforo</label>
              <input
                type="number"
                className="form-control"
                placeholder="200"
                value={nuevaZona.aforo}
                onChange={e => setNuevaZona({ ...nuevaZona, aforo: Number(e.target.value) })}
                min="1"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => onClose()}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleAgregarZona}>
                Agregar Zona
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};