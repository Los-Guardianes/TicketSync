import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ZonesAccordion, FuncionesAccordion, EntradasAccordion, PeriodosAccordion } from '../components/Acordeon';

import {
  getEventosById,
  cancelarEvento,
  getZonasByEvento,
  getFuncionesByEvento,
  getEntradasByEvento,
  getPeriodosByEvento,
  createPeriodo,
  updatePeriodo,
  deletePeriodo,
  createTipoEntrada,
  updateTipoEntrada,
  deleteTipoEntrada,
  createZona,
  updateZona,
  deleteZona,
  createFuncion,
  updateFuncion,
  deleteFuncion,
} from '../../../../globalServices/EventoService';

import './ConfigEvento.css';
import '../components/PeriodoModals.css';
import { ConfigEventoActions } from '../components/ConfigEventoActions';

export const ConfigEvento = () => {
  const { idEvento } = useParams();

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

  // Estados para modales de Zonas
  const [editingZona, setEditingZona] = useState(null);
  const [deletingZona, setDeletingZona] = useState(null);
  const [savingZona, setSavingZona] = useState(false);
  const [isNewZona, setIsNewZona] = useState(false);

  // Estados para modales de Funciones
  const [editingFuncion, setEditingFuncion] = useState(null);
  const [deletingFuncion, setDeletingFuncion] = useState(null);
  const [savingFuncion, setSavingFuncion] = useState(false);
  const [isNewFuncion, setIsNewFuncion] = useState(false);

  // Estados para modales de Periodos
  const [editingPeriodo, setEditingPeriodo] = useState(null);
  const [deletingPeriodo, setDeletingPeriodo] = useState(null);
  const [savingPeriodo, setSavingPeriodo] = useState(false);
  const [isNewPeriodo, setIsNewPeriodo] = useState(false);

  // Estados para modales de Entradas (Ticket Types)
  const [editingEntrada, setEditingEntrada] = useState(null);
  const [deletingEntrada, setDeletingEntrada] = useState(null);
  const [savingEntrada, setSavingEntrada] = useState(false);
  const [isNewEntrada, setIsNewEntrada] = useState(false);

  // Estados para notificaciones
  const [toast, setToast] = useState(null);

  const [activeAccordion, setActiveAccordion] = useState(null);
  const isActive = (key) => activeAccordion === key;

  const toggleAccordion = (key) => {
    setActiveAccordion((prev) => (prev === key ? null : key));
  };

  const editItem = (type, id) => {
    if (type === 'zona') {
      const z = zonas.find(item => item.idZona === id);
      if (z) {
        setEditingZona({ ...z });
        setIsNewZona(false);
      }
    } else if (type === 'funcion') {
      const f = funciones.find(item => item.idFuncion === id);
      if (f) {
        setEditingFuncion({ ...f });
        setIsNewFuncion(false);
      }
    } else if (type === 'periodo') {
      const p = periodos.find(item => item.idPeriodo === id);
      if (p) {
        setEditingPeriodo({ ...p });
        setIsNewPeriodo(false);
      }
    } else if (type === 'entrada') {
      const e = entradas.find(item => item.idTipoEntrada === id);
      if (e) {
        setEditingEntrada({ ...e });
        setIsNewEntrada(false);
      }
    } else {
      alert(`Editando ${type} #${id}`);
    }
  };

  const deleteItem = (type, id) => {
    if (type === 'zona') {
      const z = zonas.find(item => item.idZona === id);
      if (z) {
        setDeletingZona(z);
      }
    } else if (type === 'funcion') {
      const f = funciones.find(item => item.idFuncion === id);
      if (f) {
        setDeletingFuncion(f);
      }
    } else if (type === 'periodo') {
      const p = periodos.find(item => item.idPeriodo === id);
      if (p) {
        setDeletingPeriodo(p);
      }
    } else if (type === 'entrada') {
      const e = entradas.find(item => item.idTipoEntrada === id);
      if (e) {
        setDeletingEntrada(e);
      }
    } else {
      if (window.confirm(`¿Estás seguro de eliminar este ${type}?`)) {
        alert(`${type} #${id} eliminado`);
      }
    }
  };

  const addItem = (type) => {
    if (type === 'zona') {
      setEditingZona({
        nombre: '',
        aforo: 0,
      });
      setIsNewZona(true);
    } else if (type === 'funcion') {
      setEditingFuncion({
        fechaInicio: '',
        fechaFin: '',
        horaInicio: '',
        horaFin: '',
        activo: true,
      });
      setIsNewFuncion(true);
    } else if (type === 'entrada') {
      setEditingEntrada({
        nombre: '',
        descripcion: '',
      });
      setIsNewEntrada(true);
    } else if (type === 'periodo') {
      setEditingPeriodo({
        nombre: '',
        fechaInicio: '',
        fechaFin: '',
        tipoDesc: 'PORCENTAJE',
        valorDescuento: 0,
        activo: true,
      });
      setIsNewPeriodo(true);
    } else {
      alert(`Abriendo formulario para agregar ${type}`);
    }
  };

  const viewTickets = (funcionId) => {
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

      setEvento(prev => prev ? { ...prev, activo: false } : prev);
      setShowCancelModal(false);

      alert("El evento ha sido cancelado correctamente.");
    } catch (err) {
      console.error("Error al cancelar evento", err);
      alert("No se pudo cancelar el evento.");
    } finally {
      setCancelLoading(false);
    }
  };

  // --- Handlers para Zonas ---

  const handleSaveZona = async (e) => {
    e.preventDefault();
    if (!editingZona) return;

    if (!editingZona.nombre || editingZona.aforo < 0) {
      alert("Por favor completa todos los campos correctamente.");
      return;
    }

    try {
      setSavingZona(true);

      const zonaData = {
        idZona: editingZona.idZona,
        nombre: editingZona.nombre,
        aforo: parseInt(editingZona.aforo),
        evento: {
          idEvento: parseInt(idEvento)
        }
      };

      if (isNewZona) {
        await createZona(zonaData);
        const zonasData = await getZonasByEvento(idEvento);
        setZonas(zonasData);
        showToast('✓ Zona creada correctamente', 'success');
      } else {
        await updateZona(editingZona.idZona, zonaData);
        setZonas(prev => prev.map(z => z.idZona === editingZona.idZona ? { ...z, ...zonaData } : z));
        showToast('✓ Zona actualizada correctamente', 'success');
      }

      setEditingZona(null);
    } catch (err) {
      console.error("Error al guardar zona", err);
      showToast(`Error al guardar la zona: ${err.message}`, 'error');
    } finally {
      setSavingZona(false);
    }
  };

  const handleConfirmDeleteZona = async () => {
    if (!deletingZona) return;
    try {
      setSavingZona(true);
      await deleteZona(deletingZona.idZona);

      setZonas(prev => prev.filter(z => z.idZona !== deletingZona.idZona));

      setDeletingZona(null);
      showToast('✓ Zona eliminada correctamente', 'success');
    } catch (err) {
      console.error("Error al eliminar zona", err);
      showToast(`Error al eliminar la zona: ${err.message}`, 'error');
    } finally {
      setSavingZona(false);
    }
  };

  // --- Handlers para Funciones ---

  const handleSaveFuncion = async (e) => {
    e.preventDefault();
    if (!editingFuncion) return;

    if (!editingFuncion.fechaInicio || !editingFuncion.fechaFin || !editingFuncion.horaInicio || !editingFuncion.horaFin) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      setSavingFuncion(true);

      const funcionData = {
        idFuncion: editingFuncion.idFuncion,
        fechaInicio: editingFuncion.fechaInicio,
        fechaFin: editingFuncion.fechaFin,
        horaInicio: editingFuncion.horaInicio,
        horaFin: editingFuncion.horaFin,
        activo: editingFuncion.activo ?? true,
        evento: {
          idEvento: parseInt(idEvento)
        }
      };

      if (isNewFuncion) {
        await createFuncion(funcionData);
        const funcionesData = await getFuncionesByEvento(idEvento);
        setFunciones(funcionesData);
        showToast('✓ Función creada correctamente', 'success');
      } else {
        await updateFuncion(editingFuncion.idFuncion, funcionData);
        setFunciones(prev => prev.map(f => f.idFuncion === editingFuncion.idFuncion ? { ...f, ...funcionData } : f));
        showToast('✓ Función actualizada correctamente', 'success');
      }

      setEditingFuncion(null);
    } catch (err) {
      console.error("Error al guardar función", err);
      showToast(`Error al guardar la función: ${err.message}`, 'error');
    } finally {
      setSavingFuncion(false);
    }
  };

  const handleConfirmDeleteFuncion = async () => {
    if (!deletingFuncion) return;
    try {
      setSavingFuncion(true);
      await deleteFuncion(deletingFuncion.idFuncion);

      setFunciones(prev => prev.filter(f => f.idFuncion !== deletingFuncion.idFuncion));

      setDeletingFuncion(null);
      showToast('✓ Función eliminada correctamente', 'success');
    } catch (err) {
      console.error("Error al eliminar función", err);
      showToast(`Error al eliminar la función: ${err.message}`, 'error');
    } finally {
      setSavingFuncion(false);
    }
  };

  // --- Handlers para Periodos ---

  const handleSavePeriodo = async (e) => {
    e.preventDefault();
    if (!editingPeriodo) return;

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

      if (isNewPeriodo) {
        await createPeriodo(periodoData);
        const periodosData = await getPeriodosByEvento(idEvento);
        setPeriodos(periodosData);
        showToast('✓ Periodo creado correctamente', 'success');
      } else {
        await updatePeriodo(editingPeriodo.idPeriodo, periodoData);
        setPeriodos(prev => prev.map(p => p.idPeriodo === editingPeriodo.idPeriodo ? { ...p, ...periodoData } : p));
        showToast('✓ Periodo actualizado correctamente', 'success');
      }

      setEditingPeriodo(null);
    } catch (err) {
      console.error("Error al guardar periodo", err);
      showToast(`Error al guardar el periodo: ${err.message}`, 'error');
    } finally {
      setSavingPeriodo(false);
    }
  };

  const handleConfirmDeletePeriodo = async () => {
    if (!deletingPeriodo) return;
    try {
      setSavingPeriodo(true);
      await deletePeriodo(deletingPeriodo.idPeriodo);

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

  // --- Handlers para Entradas ---

  const handleSaveEntrada = async (e) => {
    e.preventDefault();
    if (!editingEntrada) return;

    if (!editingEntrada.nombre || !editingEntrada.descripcion) {
      alert("Por favor completa nombre y descripción.");
      return;
    }

    try {
      setSavingEntrada(true);

      const entradaData = {
        ...editingEntrada,
        evento: { idEvento: parseInt(idEvento) }
      };

      if (isNewEntrada) {
        await createTipoEntrada(entradaData);
        const entradasData = await getEntradasByEvento(idEvento);
        setEntradas(entradasData);
        showToast('✓ Tipo de entrada creado correctamente', 'success');
      } else {
        await updateTipoEntrada(editingEntrada.idTipoEntrada, entradaData);
        setEntradas(prev => prev.map(e => e.idTipoEntrada === editingEntrada.idTipoEntrada ? { ...e, ...entradaData } : e));
        showToast('✓ Tipo de entrada actualizado correctamente', 'success');
      }

      setEditingEntrada(null);
    } catch (err) {
      console.error("Error al guardar tipo de entrada", err);
      showToast(`Error al guardar: ${err.message}`, 'error');
    } finally {
      setSavingEntrada(false);
    }
  };

  const handleConfirmDeleteEntrada = async () => {
    if (!deletingEntrada) return;
    try {
      setSavingEntrada(true);
      await deleteTipoEntrada(deletingEntrada.idTipoEntrada);

      setEntradas(prev => prev.filter(e => e.idTipoEntrada !== deletingEntrada.idTipoEntrada));

      setDeletingEntrada(null);
      showToast('✓ Tipo de entrada eliminado correctamente', 'success');
    } catch (err) {
      console.error("Error al eliminar tipo de entrada", err);
      showToast(`Error al eliminar: ${err.message}`, 'error');
    } finally {
      setSavingEntrada(false);
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
    <div className="flex items-center justify-center h-screen ">

      <main className="config-container p-4">
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

      {/* MODAL DE EDICIÓN / CREACIÓN DE ZONA */}
      {editingZona && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">{isNewZona ? 'Crear Zona' : 'Editar Zona'}</h4>
            <form className="modal-form" onSubmit={handleSaveZona}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingZona.nombre}
                  onChange={e => setEditingZona({ ...editingZona, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Aforo</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingZona.aforo}
                  onChange={e => setEditingZona({ ...editingZona, aforo: parseInt(e.target.value) })}
                  required
                  min="0"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setEditingZona(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={savingZona}>
                  {savingZona ? 'Guardando...' : (isNewZona ? 'Crear' : 'Guardar Cambios')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE ELIMINAR ZONA */}
      {deletingZona && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">Eliminar Zona</h4>
            <p className="modal-text">
              ¿Estás seguro de que deseas eliminar la zona <strong>{deletingZona.nombre}</strong>?
            </p>
            <div className="modal-warning">
              Esta acción no se puede deshacer.
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeletingZona(null)}>
                Cancelar
              </button>
              <button className="btn-delete" onClick={handleConfirmDeleteZona} disabled={savingZona}>
                {savingZona ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN / CREACIÓN DE FUNCIÓN */}
      {editingFuncion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">{isNewFuncion ? 'Crear Función' : 'Editar Función'}</h4>
            <form className="modal-form" onSubmit={handleSaveFuncion}>
              <div className="form-group">
                <label className="form-label">Fecha Inicio</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingFuncion.fechaInicio}
                  onChange={e => setEditingFuncion({ ...editingFuncion, fechaInicio: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha Fin</label>
                <input
                  type="date"
                  className="form-input"
                  value={editingFuncion.fechaFin}
                  onChange={e => setEditingFuncion({ ...editingFuncion, fechaFin: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hora Inicio</label>
                <input
                  type="time"
                  className="form-input"
                  value={editingFuncion.horaInicio}
                  onChange={e => setEditingFuncion({ ...editingFuncion, horaInicio: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Hora Fin</label>
                <input
                  type="time"
                  className="form-input"
                  value={editingFuncion.horaFin}
                  onChange={e => setEditingFuncion({ ...editingFuncion, horaFin: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setEditingFuncion(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={savingFuncion}>
                  {savingFuncion ? 'Guardando...' : (isNewFuncion ? 'Crear' : 'Guardar Cambios')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE ELIMINAR FUNCIÓN */}
      {deletingFuncion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">Eliminar Función</h4>
            <p className="modal-text">
              ¿Estás seguro de que deseas eliminar esta función?
            </p>
            <div className="modal-warning">
              Esta acción no se puede deshacer.
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeletingFuncion(null)}>
                Cancelar
              </button>
              <button className="btn-delete" onClick={handleConfirmDeleteFuncion} disabled={savingFuncion}>
                {savingFuncion ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN DE PERIODO */}
      {editingPeriodo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">{isNewPeriodo ? 'Crear Periodo de Venta' : 'Editar Periodo de Venta'}</h4>
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
                  {savingPeriodo ? 'Guardando...' : (isNewPeriodo ? 'Crear' : 'Guardar Cambios')}
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

      {/* MODAL DE EDICIÓN / CREACIÓN DE ENTRADA */}
      {editingEntrada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">
              {isNewEntrada ? 'Nuevo Tipo de Entrada' : 'Editar Tipo de Entrada'}
            </h4>
            <form className="modal-form" onSubmit={handleSaveEntrada}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingEntrada.nombre}
                  onChange={e => setEditingEntrada({ ...editingEntrada, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-input"
                  value={editingEntrada.descripcion}
                  onChange={e => setEditingEntrada({ ...editingEntrada, descripcion: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setEditingEntrada(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={savingEntrada}>
                  {savingEntrada ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE ELIMINAR ENTRADA */}
      {deletingEntrada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">Eliminar Tipo de Entrada</h4>
            <p className="modal-text">
              ¿Estás seguro de que deseas eliminar la entrada <strong>{deletingEntrada.nombre}</strong>?
            </p>
            <div className="modal-warning">
              Esta acción no se puede deshacer.
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeletingEntrada(null)}>
                Cancelar
              </button>
              <button className="btn-delete" onClick={handleConfirmDeleteEntrada} disabled={savingEntrada}>
                {savingEntrada ? 'Eliminando...' : 'Sí, Eliminar'}
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