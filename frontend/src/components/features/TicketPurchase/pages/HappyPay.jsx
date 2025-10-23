import { useNavigate } from "react-router-dom";
import "./HappyPay.css";
export const HappyPay = () => {
    const navigate = useNavigate();

    const handleDownloadReport = () => {
        // Función vacía para descargar informe
        console.log("Descargando informe...");
    };

    const handleGoHome = () => {
        navigate("/home");
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
                    Recibirás un correo de confirmación con los detalles de tu pedido.
                </p>

                <div className="hp-buttons">
                    <button 
                        className="btn btn-primary" 
                        onClick={handleDownloadReport}
                    >
                        Descargar Informe
                    </button>
                    <button 
                        className="btn btn-secondary" 
                        onClick={handleGoHome}
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
};