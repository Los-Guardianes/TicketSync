import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Importa BarraLateral solo si la vas a usar
// import { BarraLateral } from '../../MisTickets/components/BarraLateral'; 

import { ZonesAccordion, FuncionesAccordion, EntradasAccordion, PeriodosAccordion } from '../components/Acordeon';

import {
  getEventosById,
  cancelarEvento,
  getZonasByEvento,
  getFuncionesByEvento,
  getEntradasByEvento,
  getPeriodosByEvento,
  updatePeriodo,
  deletePeriodo,
} from '../../../../globalServices/EventoService';

import './ConfigEvento.css';
import '../components/PeriodoModals.css'; // Importar estilos de modales
import { ConfigEventoActions } from '../components/ConfigEventoActions';
// import { ConfigEventoDatos } from '../components/ConfigEventoDatos';

export const ConfigEvento = () => {
  const { idEvento } = useParams(); // /organizer/evento/:idEvento/config

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cargaError, setCargaError] = useState(false);

  const [zonas, setZonas] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  // modal de cancelar evento
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Estados para modales de Periodos
  const [editingPeriodo, setEditingPeriodo] = useState(null);
  const [deletingPeriodo, setDeletingPeriodo] = useState(null);
  const [savingPeriodo, setSavingPeriodo] = useState(false);

  // Estados para notificaciones
  const [toast, setToast] = useState(null);

  const [activeAccordion, setActiveAccordion] = useState(null);
  const isActive = (key) => activeAccordion === key;

  const toggleAccordion = (key) => {
    setActiveAccordion((prev) => (prev === key ? null : key));
  };

  const editItem = (type, id) => {
    if (type === 'periodo') {
      const p = periodos.find(item => item.idPeriodo === id);
      if (p) {
        setEditingPeriodo({ ...p });
      }
    } else {
      // console.log(`Editar ${type} #${id}`);
      alert(`Editando ${type} #${id}`);
    }
  };

  const deleteItem = (type, id) => {
    if (type === 'periodo') {
      const p = periodos.find(item => item.idPeriodo === id);
      if (p) {
        setDeletingPeriodo(p);
      }
    } else {
      if (window.confirm(`¿Estás seguro de eliminar este ${type}?`)) {
        // console.log(`Eliminar ${type} #${id}`);
        alert(`${type} #${id} eliminado`);
      }
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

  // Función helper para mostrar notificaciones
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
        const periodosData = await getPeriodosByEvento(idEvento);
        setPeriodos(periodosData);

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

  // --- Handlers para Periodos ---

  const handleSavePeriodo = async (e) => {
    e.preventDefault();
    if (!editingPeriodo) return;

    // Validaciones básicas
    if (!editingPeriodo.nombre || !editingPeriodo.fechaInicio || !editingPeriodo.fechaFin) {
      alert("Por favor completa todos los campos.");
      return;
    }
    if (new Date(editingPeriodo.fechaInicio) > new Date(editingPeriodo.fechaFin)) {
      alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
      return;
    }

    try {
      setSavingPeriodo(true);

      // Preparar objeto con TODOS los campos del periodo para no perder datos
      const periodoData = {
        idPeriodo: editingPeriodo.idPeriodo,
        nombre: editingPeriodo.nombre,
        fechaInicio: editingPeriodo.fechaInicio,
        fechaFin: editingPeriodo.fechaFin,
        tipoDesc: editingPeriodo.tipoDesc,
        valorDescuento: editingPeriodo.valorDescuento,
        activo: editingPeriodo.activo,
        evento: {
          idEvento: parseInt(idEvento)
        }
      };

      console.log("Periodo a modificarse: ", periodoData);
      // Llamada al backend
      await updatePeriodo(editingPeriodo.idPeriodo, periodoData);

      // Actualizar estado local
      setPeriodos(prev => prev.map(p => p.idPeriodo === editingPeriodo.idPeriodo ? { ...p, ...periodoData } : p));

      // Cerrar modal
      setEditingPeriodo(null);
      showToast('✓ Periodo actualizado correctamente', 'success');
    } catch (err) {
      console.error("Error al actualizar periodo", err);
      showToast(`Error al actualizar el periodo: ${err.message}`, 'error');
    } finally {
      setSavingPeriodo(false);
    }
  };

  const handleConfirmDeletePeriodo = async () => {
    if (!deletingPeriodo) return;
    try {
      setSavingPeriodo(true);
      await deletePeriodo(deletingPeriodo.idPeriodo);

      // Actualizar estado local
      setPeriodos(prev => prev.filter(p => p.idPeriodo !== deletingPeriodo.idPeriodo));

      setDeletingPeriodo(null);
      showToast('✓ Periodo eliminado correctamente', 'success');
    } catch (err) {
      console.error("Error al eliminar periodo", err);
      showToast(`Error al eliminar el periodo: ${err.message}`, 'error');
    } finally {
      setSavingPeriodo(false);
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
                <EntradasAccordion
                  isActive={isActive('entradas')}
                  onToggle={toggleAccordion}
                  editItem={editItem}
                  deleteItem={deleteItem}
                  addItem={addItem}
                  entradas={entradas}
                />
                <PeriodosAccordion
                  isActive={isActive('periodos')}
                  onToggle={toggleAccordion}
                  editItem={editItem}
                  deleteItem={deleteItem}
                  addItem={addItem}
                  periodos={periodos}
                />

              </div>

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

      {/* MODAL DE EDICIÓN DE PERIODO */}
      {editingPeriodo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">Editar Periodo de Venta</h4>
            <form className="modal-form" onSubmit={handleSavePeriodo}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingPeriodo.nombre}
                  onChange={e => setEditingPeriodo({ ...editingPeriodo, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha Inicio</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingPeriodo.fechaInicio}
                  onChange={e => setEditingPeriodo({ ...editingPeriodo, fechaInicio: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha Fin</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingPeriodo.fechaFin}
                  onChange={e => setEditingPeriodo({ ...editingPeriodo, fechaFin: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setEditingPeriodo(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={savingPeriodo}>
                  {savingPeriodo ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE ELIMINAR PERIODO */}
      {deletingPeriodo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">Eliminar Periodo</h4>
            <p className="modal-text">
              ¿Estás seguro de que deseas eliminar el periodo <strong>{deletingPeriodo.nombre}</strong>?
            </p>
            <div className="modal-warning">
              Esta acción no se puede deshacer.
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeletingPeriodo(null)}>
                Cancelar
              </button>
              <button className="btn-delete" onClick={handleConfirmDeletePeriodo} disabled={savingPeriodo}>
                {savingPeriodo ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST DE NOTIFICACIONES */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
};