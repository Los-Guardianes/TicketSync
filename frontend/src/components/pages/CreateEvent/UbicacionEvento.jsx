import React, { useState, useRef } from "react";
import logo from "../../../assets/TUTICKET_PNG_SIN_ESPACIOS.png";
import { useNavigate } from "react-router-dom";
import "./UbicacionEvento.css";

export const UbicacionEvento = () => {
  const navigate = useNavigate();
  const [departamento, setDepartamento] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  // const [referencia, setReferencia] = useState("");
  const [mapa, setMapa] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const dragCounter = useRef(0);
  const inputFileRef = useRef(null);

  // Drag and drop handlers para el mapa
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
      setMapa(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <div className="ubicacion-evento-container">
        <div className="header">
          <span className="step">2</span>
          <h2>Ubicación</h2>
        </div>
        <form className="ubicacion-form">
        <div className="form-content">
          <div className="form-left">
            <div className="campo">
              <label htmlFor="departamento">Departamento</label>
              <select id="departamento" value={departamento} onChange={e => setDepartamento(e.target.value)}>
                <option value="">Elige un departamento</option>
                <option value="lima">Lima</option>
                <option value="arequipa">Arequipa</option>
                <option value="cusco">Cusco</option>
                {/* Agrega más departamentos según tu necesidad */}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="ciudad">Ciudad</label>
              <select id="ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)}>
                <option value="">Elige una ciudad</option>
                {/* Opciones dinámicas según departamento */}
                <option value="lima">Lima</option>
                <option value="arequipa">Arequipa</option>
                <option value="cusco">Cusco</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="direccion">Dirección</label>
              <input
                id="direccion"
                type="text"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                placeholder="Escribe la dirección del evento"
              />
            </div>
            {/* Campo referencia eliminado */}
          </div>
          <div className="form-right">
            <div className="campo">
              <label htmlFor="mapa">Mapa de referencia</label>
              <div
                className={`mapa-placeholder${dragActive ? ' drag-active' : ''}`}
                onClick={() => inputFileRef.current && inputFileRef.current.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ cursor: 'pointer', position: 'relative', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {mapa ? (
                  <div style={{ position: 'relative', width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={URL.createObjectURL(mapa)}
                      alt="Mapa de referencia"
                      style={{ maxWidth: '300px', maxHeight: '160px', objectFit: 'contain', borderRadius: '8px', margin: '0 auto' }}
                    />
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setMapa(null);
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
                      title="Eliminar mapa"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  !dragActive && (
                    <span style={{ color: '#219653', fontWeight: 500, fontSize: '1.2rem', textAlign: 'center' }}>
                      + Añade un mapa
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
                      setMapa(e.target.files[0]);
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
                    Suelta el mapa aquí
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="cancel" onClick={() => navigate("/create-event")}>Regresar</button>
          <button type="submit" className="next">Siguiente</button>
        </div>
      </form>
    </div>
    </>
  );
};
