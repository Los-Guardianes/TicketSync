import React from "react";
import { useNavigate } from "react-router-dom";

export const RegisterOptions = () => {
  const navigate = useNavigate();


  const bgUrl = "src/assets/wallhaven-4gjdrd.jpg"; 

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundImage: `url('${bgUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="bg-white shadow"
        style={{
          width: "min(92vw, 560px)",
          borderRadius: "16px",
          padding: "36px 28px",
        }}
        aria-labelledby="register-title"
        role="dialog"
      >
        <div className="text-center mb-3">
          <img
            src="src/assets/TUTICKET_PNG_SIN_ESPACIOS.png"
            alt="TuTicket"
            style={{ width: 56, height: "auto", objectFit: "contain" }}
          />
        </div>

        <h2
          id="register-title"
          className="text-center fw-semibold mb-3"
          style={{ color: "#2EA062" }}
        >
          Registrate
        </h2>

        <hr className="my-3" />

        <div className="d-grid gap-3 mt-3">
          <button
            type="button"
            className="btn btn-dark py-2"
            onClick={() => navigate("/register-client")}
            aria-label="Registrarse como cliente"
          >
            Registrarse como cliente
          </button>

          <button
            type="button"
            className="btn btn-dark py-2"
            onClick={() => navigate("/register-organizer")}
            aria-label="Registrarse como organizador"
          >
            Registrarse como organizador
          </button>
        </div>
      </div>
    </div>
  );
};
