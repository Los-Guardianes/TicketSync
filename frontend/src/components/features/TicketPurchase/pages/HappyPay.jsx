import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { descargarComprobante } from '../../../../globalServices/PDFService'; 
import "./HappyPay.css";

export const HappyPay = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { idOrden } = location.state || {};
    const [error, setError] = useState('');

    const handleDescarga = async () => {
        setError('');
        console.log("Descargando informe...");
        try {
          await descargarComprobante(idOrden);
        } catch (err) {
          setError(err.message || 'Error al descargar el comprobante');
        }
    };

    const handleGoTickets = () => {
        navigate("/MisTickets");
    };

    return (
        <div className="hp-container">
            <div className="hp-card">
                <div className="hp-icon">
                    <svg 
                        width="80" 
                        height="80" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                </div>

                <h1 className="hp-title">¡Pago Exitoso!</h1>
                <p className="hp-message">
                    Tu compra ha sido procesada correctamente.                   
                </p>

                <div className="hp-buttons">                    
                    <button 
                        className="btn btn-secondary" 
                        onClick={handleGoTickets}
                    >
                        Ver mis tickets
                    </button>
                    {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
};