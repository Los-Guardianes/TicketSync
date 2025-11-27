import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ZonesAccordion, FuncionesAccordion, EntradasAccordion } from '../components/Acordeon';

import {
  getEventosById,
  cancelarEvento,
  getZonasByEvento,
  getFuncionesByEvento,
  getEntradasByEvento,
} from '../../../../globalServices/EventoService';

import './ConfigEvento.css';
import { ConfigEventoActions } from '../components/ConfigEventoActions';
import { ConfigEventoDatos } from '../components/ConfigEventoDatos';

export const ConfigEvento = () => {
  const { idEvento } = useParams(); // /organizer/evento/:idEvento/config

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cargaError, setCargaError] = useState(false);

  const [zonas, setZonas] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [entradas, setEntradas] = useState([]);

  // modal de cancelar evento
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [activeAccordion, setActiveAccordion] = useState(null);
  const isActive = (key) => activeAccordion === key;
  
  const toggleAccordion = (key) => {
    setActiveAccordion((prev) => (prev === key ? null : key));
  };

  const editItem = (type, id) => {
    // console.log(`Editar ${type} #${id}`);
    alert(`Editando ${type} #${id}`);
  };

  const deleteItem = (type, id) => {
    if (window.confirm(`¿Estás seguro de eliminar este ${type}?`)) {
      // console.log(`Eliminar ${type} #${id}`);
      alert(`${type} #${id} eliminado`);
    }
  };

  const addItem = (type) => {
    // console.log(`Agregar nuevo ${type}`);
    alert(`Abriendo formulario para agregar ${type}`);
  };

  const viewTickets = (funcionId) => {
    // console.log(`Ver tickets de función #${funcionId}`);
    alert(`Mostrando tickets de la función #${funcionId}`);
  };


  // cargar evento desde backend
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getEventosById(idEvento);
        setEvento(data);
        const zonaData = await getZonasByEvento(idEvento);
        setZonas(zonaData);
        const funcionesData = await getFuncionesByEvento(idEvento);
        setFunciones(funcionesData);
        const entradasData = await getEntradasByEvento(idEvento);
        setEntradas(entradasData);
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
      <div className="config-page">
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

      <main className="flex-grow-1 p-4">
        <div className="config-card">
          <h3 className="config-card-title">Configuración de evento</h3>
          <div className="config-layout">
            <div className="config-left">
              <h5 className="config-event-name">{tituloEvento}</h5>

              <div
                className="config-event-cover"
                style={
                  imagenEvento
                    ? { backgroundImage: `url(${imagenEvento})` }
                    : undefined
                }
              />
              
              {/* <ConfigEventoDatos 
                isActive,
              onToggle,
              editItem,
              deleteItem,
              addItem,
              viewTickets,
              /> */}
              
              <p className="config-event-location">{direccion}</p>
              <div className="tabs-section">
                <ZonesAccordion
                  isActive={isActive('zonas')}
                  onToggle={toggleAccordion}
                  editItem={editItem}
                  deleteItem={deleteItem}
                  addItem={addItem}
                  zonas={zonas}
                />
                <FuncionesAccordion
                  isActive={isActive('funciones')}
                  onToggle={toggleAccordion}
                  editItem={editItem}
                  deleteItem={deleteItem}
                  addItem={addItem}
                  viewTickets={viewTickets}
                  funciones={funciones}
                />
              </div>
              <EntradasAccordion
                isActive={isActive('entradas')}
                onToggle={toggleAccordion}
                editItem={editItem}
                deleteItem={deleteItem}
                addItem={addItem}
                entradas={entradas}
              s/>
              {evento.activo === false && (
                <p className="evento-cancelado">Este evento está cancelado.</p>
              )}

            </div>

            <div className="config-right">
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
