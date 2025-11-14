import "./ModalTipoEntrada.css";
import { X, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export const ModalTipoEntrada = ({ 
  isOpen, 
  onClose,
  nuevoTipoEntrada,
  setNuevoTipoEntrada,
  handleAgregarTipoEntrada,
  setModalTipoEntradaAbierto,
  eventData,
  currentMoneda,
  onHandleAsignarPrecioZona
}) => {
    const [tarifasTemporales, setTarifasTemporales] = useState([]);
    const [indiceActualScroll, setIndiceActualScroll] = useState(0);

    // SI NO ESTA ABIERTO, NO RETORNARÁ NADA
    if (!isOpen) return null;

    const zonasSeleccionadas = tarifasTemporales.map(t => t.zona).filter(z => z);
    const zonasDisponibles = eventData.zonas?.filter(
        zona => !zonasSeleccionadas.includes(zona.nombre)
    ) || [];

    const agregarTarifaTemporal = () => {
        if (zonasDisponibles.length === 0) return;
        
        setTarifasTemporales([
            ...tarifasTemporales,
            { zona: zonasDisponibles[0]?.nombre || '', precio: '' }
        ]);
    };

    const actualizarTarifaTemporal = (index, campo, valor) => {
        const nuevasTarifas = [...tarifasTemporales];
        nuevasTarifas[index] = {
            ...nuevasTarifas[index],
            [campo]: valor
        };
        setTarifasTemporales(nuevasTarifas);
    };

    const eliminarTarifaTemporal = (index) => {
        const nuevasTarifas = tarifasTemporales.filter((_, i) => i !== index);
        setTarifasTemporales(nuevasTarifas);
    };

    const irIzquierda = () => {
        if (indiceActualScroll > 0) {
            setIndiceActualScroll(indiceActualScroll - 1);
        }
    };

    const irDerecha = () => {
        if (indiceActualScroll < tarifasTemporales.length - 1) {
            setIndiceActualScroll(indiceActualScroll + 1);
        }
    };

    const handleFinalizarModal = () => {
        // Validar que tenga nombre
        if (!nuevoTipoEntrada.nombre || nuevoTipoEntrada.nombre.trim() === '') {
            alert("Por favor ingresa un nombre para el tipo de entrada");
            return;
        }

        // Guardar todas las tarifas temporales usando la función de parámetro
        tarifasTemporales.forEach(tarifa => {
            if (tarifa.zona && tarifa.precio) {
                onHandleAsignarPrecioZona(tarifa.zona, Number(tarifa.precio));
            }
        });

        handleAgregarTipoEntrada();
        setTarifasTemporales([]);
        setIndiceActualScroll(0);
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content modal-tipo-entrada-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Agregar Tipo de Entrada con Tarifas</h3>
            <button className="modal-close" onClick={onClose}>
              <X style={{ width: 24, height: 24 }} />
            </button>
          </div>
          <div className="modal-body">
              {/* Información del Tipo de Entrada */}
              <div className="seccion-tipo-entrada">
                <div className="modal-field">
                  <label>Nombre del Tipo</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="VIP, GENERAL, PALCO"
                    value={nuevoTipoEntrada.nombre}
                    onChange={e => setNuevoTipoEntrada({ ...nuevoTipoEntrada, nombre: e.target.value })}
                  />
                </div>
              </div>

              {/* Asignación de Tarifas por Zona */}
              <div>
                <div className="seccion-header">
                  <label>Asignar Precios por Zona</label>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={agregarTarifaTemporal}
                    disabled={zonasDisponibles.length === 0 && tarifasTemporales.length > 0}
                  >
                    <Plus style={{ width: 16, height: 16 }} />
                    Agregar zona
                  </button>
                </div>
                
                {tarifasTemporales.length === 0 ? (
                  <div className="empty-tarifas">
                    <p>No hay zonas asignadas. Haz clic en "Agregar Zona" para comenzar.</p>
                  </div>
                ) : (
                  <div className="lista-tarifas-scroll">
                    <button 
                      className="btn-scroll btn-scroll-left"
                      onClick={irIzquierda}
                      disabled={indiceActualScroll === 0}
                      title="Zona anterior"
                    >
                      <ChevronLeft style={{ width: 20, height: 20 }} />
                    </button>

                    <div className="lista-tarifas-container">
                      <div 
                        className="lista-tarifas"
                        style={{
                          transform: `translateX(-${indiceActualScroll * 94}%)`,
                          transition: 'transform 0.3s ease'
                        }}
                      >
                        {tarifasTemporales.map((tarifa, index) => (
                          <div key={index} className="tarifa-item">
                            <div className="tarifa-content">
                              <div className="tarifa-field">
                                <label>Zona</label>
                                <select
                                  className="form-control"
                                  value={tarifa.zona}
                                  onChange={e => actualizarTarifaTemporal(index, 'zona', e.target.value)}
                                >
                                  <option value="">Seleccionar zona...</option>
                                  {eventData.zonas?.map((zona, i) => {
                                    const yaSeleccionada = zonasSeleccionadas.includes(zona.nombre) && zona.nombre !== tarifa.zona;
                                    return (
                                      <option key={i} value={zona.nombre} disabled={yaSeleccionada}>
                                        {zona.nombre} (Aforo: {zona.aforo})
                                        {yaSeleccionada ? ' - Seleccionada' : ''}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div className="tarifa-field">
                                <label>Precio ({currentMoneda})</label>
                                <div className="input-group">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="0.00"
                                    value={tarifa.precio}
                                    onChange={e => actualizarTarifaTemporal(index, 'precio', e.target.value)}
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                              </div>
                            </div>
                            <button
                              className="btn-eliminar-tarifa"
                              onClick={() => eliminarTarifaTemporal(index)}
                              title="Eliminar zona"
                            >
                              <Trash2 style={{ width: 24, height: 24 }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      className="btn-scroll btn-scroll-right"
                      onClick={irDerecha}
                      disabled={indiceActualScroll === tarifasTemporales.length - 1}
                      title="Siguiente zona"
                    >
                      <ChevronRight style={{ width: 20, height: 20 }} />
                    </button>

                    {/* Indicador de posición */}
                    <div className="scroll-indicator">
                      {indiceActualScroll + 1} de {tarifasTemporales.length}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => {
                  setModalTipoEntradaAbierto(false);
                  setTarifasTemporales([]);
                  setIndiceActualScroll(0);
                }}>
                  Cancelar
                </button>
                <button className="btn-primary" onClick={handleFinalizarModal}>
                  Finalizar
                </button>
              </div>
          </div>
        </div>
      </div>
    );
}
