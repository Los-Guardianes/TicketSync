import React, { useState } from "react";
import "./CreateEvent.css";

export const CreateEvent = () => {
  const [nombre, setNombre] = useState("");
  const [funciones, setFunciones] = useState([{ inicio: "", fin: "" }]);

  const agregarFuncion = () => {
    setFunciones([...funciones, { inicio: "", fin: "" }]);
  };

  const eliminarFuncion = (index) => {
    setFunciones(funciones.filter((_, i) => i !== index));
  };

  return (
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
                <option value="conferencia">Conferencia</option>
              </select>
            </div>

            <div className="funciones-section">
              <div className="funciones-header">
                <span className="agregar-funcion" onClick={agregarFuncion}>+ Agregar función</span>
                <span className="eliminar-funcion" onClick={() => eliminarFuncion(funciones.length-1)}>Eliminar función</span>
              </div>
              {funciones.map((funcion, index) => (
                <div key={index} className="funcion">
                  <div className="funcion-label">Función {index + 1}</div>
                  <div className="fechas">
                    <div className="fecha-hora">
                      <label>Fecha y hora de inicio</label>
                      <input type="date" />
                      <input type="time" />
                    </div>
                    <div className="fecha-hora">
                      <label>Fecha y hora de fin</label>
                      <input type="date" />
                      <input type="time" />
                    </div>
                  </div>
                </div>
              ))}
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
              <div className="imagen-placeholder">+ Añade una imagen</div>
            </div>
            <div className="campo">
              <label htmlFor="info-adicional">Información adicional</label>
              <textarea id="info-adicional" placeholder="Brinde a los usuarios mas información: Detalles del evento, duración aproximada, panelistas, links relacionados, cronograma de eventos, etc." />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button type="button" className="cancel">
            Cancelar
          </button>
          <button type="submit" className="next">
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};
