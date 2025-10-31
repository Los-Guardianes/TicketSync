import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { BarraLateral } from '../../MisTickets/components/BarraLateral';

import {
  getEventosById,
  cancelarEvento,
} from '../../../../globalServices/EventoService';

import './ConfigEvento.css';
import { ConfigEventoActions } from '../components/ConfigEventoActions';

export const ConfigEvento = () => {
  const { idEvento } = useParams(); // /organizer/evento/:idEvento/config

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cargaError, setCargaError] = useState(false);

  // modal de cancelar evento
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // cargar evento desde backend
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getEventosById(idEvento);
        setEvento(data);
      } catch (err) {
        console.error('Error cargando el evento', err);
        setCargaError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [idEvento]);

  // confirmar cancelación → PUT /api/evento/{id}/cancelar
  const confirmarCancelacion = async () => {
    try {
      setCancelLoading(true);

      await cancelarEvento(idEvento);

      // reflejar en estado local (activo=false)
      setEvento(prev => prev ? { ...prev, activo: false } : prev);

      // cerrar modal
      setShowCancelModal(false);

      alert("El evento ha sido cancelado correctamente.");
    } catch (err) {
      console.error("Error al cancelar evento", err);
      alert("No se pudo cancelar el evento.");
    } finally {
      setCancelLoading(false);
    }
  };

  // estados intermedios de carga / error
  if (loading) {
    return (
      <div className="d-flex">
        <BarraLateral />
        <main className="flex-grow-1 p-4">
          <div className="config-card">
            <h3 className="config-card-title">Configuración de evento</h3>
            <p className="text-muted mb-0">Cargando...</p>
          </div>
        </main>
      </div>
    );
  }

  if (cargaError || !evento) {
    return (
      <div className="d-flex">
        <BarraLateral />
        <main className="flex-grow-1 p-4">
          <div className="config-card">
            <h3 className="config-card-title">Configuración de evento</h3>
            <p className="text-danger mb-0">
              No se pudo cargar la información del evento.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // datos del evento
  const tituloEvento = evento.nombre ?? 'Sin título';
  const imagenEvento = evento.urlImagen;
  const direccion = evento.direccion ?? 'Dirección no registrada';

  return (
    <div className="d-flex">
      <BarraLateral />

      <main className="flex-grow-1 p-4">
        <div className="config-card">
          <h3 className="config-card-title">Configuración de evento</h3>

          <div className="row g-4 align-items-start">
            {/* COLUMNA IZQUIERDA */}
            <div className="col-12 col-lg-6 config-event-left">
              <h5 className="config-event-name">{tituloEvento}</h5>

              <div
                className="config-event-cover"
                style={
                  imagenEvento
                    ? { backgroundImage: `url(${imagenEvento})` }
                    : undefined
                }
              />

              <p className="config-event-location">{direccion}</p>

              {evento.activo === false && (
                <p
                  style={{
                    marginTop: '8px',
                    color: '#d00',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                >
                  Este evento está cancelado.
                </p>
              )}
            </div>

            {/* COLUMNA DERECHA */}
            <div className="col-12 col-lg-6">
              <ConfigEventoActions
                idEvento={idEvento}
                onCancelar={() => setShowCancelModal(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE CONFIRMACIÓN DE CANCELACIÓN */}
      {showCancelModal && (
        <div className="cancel-modal-overlay">
          <div className="cancel-modal">
            <h4 className="cancel-modal-title">¿Cancelar este evento?</h4>

            <p className="cancel-modal-text">
              Si lo cancelas, dejará de estar disponible para la compra de entradas.
              Esta acción se puede revertir manualmente, pero los clientes dejarán de verlo como activo.
            </p>

            <div className="cancel-modal-details">
              <div className="cancel-modal-name">{evento?.nombre}</div>
              <div className="cancel-modal-location">{evento?.direccion}</div>
            </div>

            <div className="cancel-modal-actions">
              <button
                className="btn-cancelar-outline"
                disabled={cancelLoading}
                onClick={() => setShowCancelModal(false)}
              >
                No, volver
              </button>

              <button
                className="btn-cancelar-danger"
                disabled={cancelLoading}
                onClick={confirmarCancelacion}
              >
                {cancelLoading ? 'Cancelando...' : 'Sí, cancelar evento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
