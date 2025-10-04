import React, { useState, useRef } from "react";
import logo from "../../../assets/TUTICKET_PNG_SIN_ESPACIOS.png";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";

export const CreateEvent = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [funciones, setFunciones] = useState([{ inicio: "", fin: "" }]);
  const [funcionActual, setFuncionActual] = useState(0);
  const [imagen, setImagen] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const dragCounter = useRef(0);
  const inputFileRef = useRef(null);

  // Drag and drop handlers con contador
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragActive(false);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImagen(e.dataTransfer.files[0]);
    }
  };

  // Agrega una nueva función y navega a ella
  const agregarFuncion = () => {
    setFunciones([...funciones, { inicio: "", fin: "" }]);
    setFuncionActual(funciones.length); // Navega a la nueva función
  };

  // Elimina la función actual
  const eliminarFuncion = () => {
    if (funciones.length === 1) return; // No eliminar si solo hay una
    const nuevasFunciones = funciones.filter((_, i) => i !== funcionActual);
    setFunciones(nuevasFunciones);
    setFuncionActual((prev) => {
      if (prev >= nuevasFunciones.length) return nuevasFunciones.length - 1;
      return prev;
    });
  };

  // Navegación circular
  const irFuncionIzquierda = () => {
    setFuncionActual((prev) => (prev === 0 ? funciones.length - 1 : prev - 1));
  };
  const irFuncionDerecha = () => {
    setFuncionActual((prev) => (prev === funciones.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="crear-evento-container">
      {/* Encabezado */}
      <div className="header">
        <span className="step">1</span>
        <h2>Detalles del evento</h2>
      </div>

      {/* Formulario principal */}
      <form className="evento-form">
        <div className="form-content">
          {/* Columna izquierda */}
          <div className="form-left">
            <div className="campo">
              <label htmlFor="nombre">Nombre de evento</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese el nombre del evento"
              />
            </div>

            <div className="campo">
              <label htmlFor="categoria">Categoría</label>
              <select id="categoria">
                <option>Elige una categoría</option>
                <option value="concierto">Concierto</option>
                <option value="deporte">Deporte</option>
                <option value="teatro">Teatro</option>
                <option value="conferencia">Fiesta</option>
              </select>
            </div>

            <div className="funciones-section">
              <div className="funciones-header">
                <span className="agregar-funcion" onClick={agregarFuncion}>+ Agregar función</span>
                <span className="eliminar-funcion" onClick={eliminarFuncion}>Eliminar función</span>
              </div>
              <div className="funcion-navegacion">
                <button type="button" className="flecha" onClick={irFuncionIzquierda}>
                  &#60;
                </button>
                <span className="funcion-label">Función {funcionActual + 1} de {funciones.length}</span>
                <button type="button" className="flecha" onClick={irFuncionDerecha}>
                  &#62;
                </button>
              </div>
              <div className="funcion">
                <div className="fechas">
                  <div className="fecha-hora">
                    <label>Fecha y hora de inicio</label>
                    <input
                      type="date"
                      value={funciones[funcionActual].inicioFecha || ""}
                      onChange={e => {
                        const nuevas = [...funciones];
                        nuevas[funcionActual] = {
                          ...nuevas[funcionActual],
                          inicioFecha: e.target.value
                        };
                        setFunciones(nuevas);
                      }}
                    />
                    <input
                      type="time"
                      value={funciones[funcionActual].inicioHora || ""}
                      onChange={e => {
                        const nuevas = [...funciones];
                        nuevas[funcionActual] = {
                          ...nuevas[funcionActual],
                          inicioHora: e.target.value
                        };
                        setFunciones(nuevas);
                      }}
                    />
                  </div>
                  <div className="fecha-hora">
                    <label>Fecha y hora de fin</label>
                    <input
                      type="date"
                      value={funciones[funcionActual].finFecha || ""}
                      onChange={e => {
                        const nuevas = [...funciones];
                        nuevas[funcionActual] = {
                          ...nuevas[funcionActual],
                          finFecha: e.target.value
                        };
                        setFunciones(nuevas);
                      }}
                    />
                    <input
                      type="time"
                      value={funciones[funcionActual].finHora || ""}
                      onChange={e => {
                        const nuevas = [...funciones];
                        nuevas[funcionActual] = {
                          ...nuevas[funcionActual],
                          finHora: e.target.value
                        };
                        setFunciones(nuevas);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="campo">
              <label htmlFor="restricciones">Restricciones</label>
              <input id="restricciones" type="text" placeholder="Agrega una restricción" />
            </div>

            <div className="campo">
              <label htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" placeholder="Escriba un párrafo corto pero potente que describa tu evento" />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="form-right">
            <div className="campo">
              <label htmlFor="imagen">Imagen (836px x 522px)</label>
              <div
                className={`imagen-placeholder${dragActive ? ' drag-active' : ''}`}
                onClick={() => inputFileRef.current && inputFileRef.current.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {imagen ? (
                  <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={URL.createObjectURL(imagen)}
                      alt="Vista previa"
                      style={{ maxWidth: '300px', maxHeight: '160px', objectFit: 'contain', borderRadius: '8px', margin: '0 auto' }}
                    />
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setImagen(null);
                        if (inputFileRef.current) inputFileRef.current.value = "";
                      }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: '#fff',
                        color: '#d32f2f',
                        border: '1px solid #d32f2f',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        zIndex: 3
                      }}
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  !dragActive && (
                    <span style={{ color: '#219653', fontWeight: 500, fontSize: '1.2rem' }}>
                      Presione o arrastre aquí para subir una imagen
                    </span>
                  )
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={inputFileRef}
                  style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setImagen(e.target.files[0]);
                    }
                  }}
                />
                {dragActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(33,150,83,0.08)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#219653',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    zIndex: 2
                  }}>
                    Suelta la imagen aquí
                  </div>
                )}
              </div>
            </div>
            <div className="campo">
              <label htmlFor="info-adicional">Información adicional</label>
              <textarea id="info-adicional" placeholder="Brinde a los usuarios mas información: Detalles del evento, duración aproximada, panelistas, links relacionados, cronograma de eventos, etc." />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel"
            onClick={() => navigate("/home")}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="next"
            onClick={() => navigate("/ubicacion-evento")}
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
    </>
  );
};
