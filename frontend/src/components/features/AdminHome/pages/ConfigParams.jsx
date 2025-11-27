import React, { useState, useEffect } from "react";
import { getParams, putParams } from "../service/paramsService";
import { useNavigate } from 'react-router-dom';
import "./ConfigUsers.css";

export const ConfigParams = () => {
  const navigate = useNavigate();
  const [comisionGlobal, setComisionGlobal] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const data = await getParams();
        const data1 = data?.[0];
        if (data1?.comisionGlobal !== undefined) {
          setComisionGlobal(data1.comisionGlobal.toString());
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
      navigate("/home-admin");
    } catch (err) {
      console.error("Error al guardar parámetros", err);
      alert("No se pudieron guardar los parámetros.");
    }
  };

  // Estilos embebidos
  const wrapperStyle = {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
    gap: "20px",
  };

  const cardStyle = {
    background: "#B6E6C9",
    border: "1px solid #B6E6C9",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "100%",
    padding: "24px 28px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  };

  const labelStyle = {
    fontSize: "0.9rem",
  };

  return (
    <div style={wrapperStyle}>
      <div className="d-flex justify-content-start mt-3">
        <button className="btn btn-outline-primary w-auto" onClick={() => navigate("/home-admin")}>
          ← Volver
        </button>
      </div>
      <div style={cardStyle}>
        <h6 className="fw-bold">
          <i className="bi bi-gear-fill me-2"></i>Parámetros de la plataforma
        </h6>
        <p className="mb-3" style={{ fontSize: "0.9rem" }}>
          Configura los ajustes principales del sistema.
        </p>

        <form>
          <div className="mb-2">
            <label
              htmlFor="comisionGlobal"
              className="form-label fw-semibold"
              style={labelStyle}
            >
              Comisión Global (%)
            </label>
            <input
              type="text"
              id="comisionGlobal"
              className="form-control form-control-sm"
              placeholder={comisionGlobal}
              value={comisionGlobal}
              onChange={(e) => setComisionGlobal(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary w-100 mt-3"
            onClick={handleGuardarParametros}
          >
            Guardar configuración
          </button>
        </form>
      </div>
    </div>
  );
};