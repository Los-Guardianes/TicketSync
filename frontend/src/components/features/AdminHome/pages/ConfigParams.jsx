import React, { useState, useEffect } from "react";
import { getParams, putParams } from "../service/paramsService";
import { useNavigate } from 'react-router-dom';
import "./ConfigUsers.css";

export const ConfigParams = () => {
  const navigate = useNavigate();
  const [comisionGlobal, setComisionGlobal] = useState("");
  const [comisionGlobalActual, setComisionGlobalActual] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const data = await getParams();
        const data1 = data?.[0];
        if (data1?.comisionGlobal !== undefined) {
          setComisionGlobal(data1.comisionGlobal.toString());
          setComisionGlobalActual(data1.comisionGlobal.toString());
        }
      } catch (err) {
        console.error("Error al obtener parámetros", err);
        alert("No se pudieron cargar los parámetros.");
      } finally {
        setLoading(false);
      }
    };

    fetchParams();
  }, []);

  const handleGuardarParametros = async () => {
    try {
      if (isNaN(comisionGlobal) || comisionGlobal < 0 || comisionGlobal > 100) {
        alert("El valor debe ser un número entre 0 y 100.");
        return;
      }

      const payload = {
        comisionGlobal: Number(comisionGlobal),
      };

      await putParams(payload, 1);
      alert("Parámetros guardados correctamente.");
      // Actualizar el valor actual después de guardar
      setComisionGlobalActual(comisionGlobal);
    } catch (err) {
      console.error("Error al guardar parámetros", err);
      alert("No se pudieron guardar los parámetros.");
    }
  };

  return (
    <div className="config-users-wrapper">
      <div className="config-users-container" style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: 'transparent', boxShadow: 'none', padding: '20px' }}>
        <div className="d-flex justify-content-start mb-3">
          <button className="btn btn-outline-primary w-auto" onClick={() => navigate("/home-admin")}>
            ← Volver
          </button>
        </div>

        <h3 className="mb-2">Parámetros de la Plataforma</h3>
        <p className="mb-4" style={{ fontSize: '0.95rem', color: '#6c757d' }}>
          Configura los ajustes principales del sistema.
        </p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h5 className="card-title mb-4">
                <i className="bi bi-percent me-2"></i>
                Comisión Global
              </h5>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="comisionActual" className="form-label fw-semibold">
                    Valor Actual
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="comisionActual"
                      className="form-control"
                      value={comisionGlobalActual}
                      readOnly
                      style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                    />
                    <span className="input-group-text">%</span>
                  </div>
                  <small className="text-muted">Este es el valor actualmente activo</small>
                </div>

                <div className="col-md-6">
                  <label htmlFor="comisionNueva" className="form-label fw-semibold">
                    Nuevo Valor
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      id="comisionNueva"
                      className="form-control"
                      value={comisionGlobal}
                      onChange={(e) => setComisionGlobal(e.target.value)}
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="0-100"
                    />
                    <span className="input-group-text">%</span>
                  </div>
                  <small className="text-muted">Ingresa un valor entre 0 y 100</small>
                </div>
              </div>

              <div className="alert alert-info d-flex align-items-start" role="alert">
                <i className="bi bi-info-circle me-2 mt-1"></i>
                <div>
                  <strong>Información:</strong> La comisión global se aplica a todas las transacciones de la plataforma.
                  Los cambios son efectivos inmediatamente.
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/home-admin")}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGuardarParametros}
                  disabled={comisionGlobal === comisionGlobalActual}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Guardar Configuración
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};