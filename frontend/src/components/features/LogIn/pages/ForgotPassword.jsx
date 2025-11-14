import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "../service/useForgotPassword";
import "./ForgotPassword.css";
// 1. Importa useState y useEffect
import { useState, useEffect } from "react";

export const ForgotPassword = () => {

    const navigate = useNavigate();

    // Renombramos 'handleSubmit' para evitar conflictos
    const {
        email,
        isLoading,
        handleSubmit: handleForgotSubmit, // Renombrado
        setEmail
    } = useForgotPassword();

    // 2. Añade el estado para el contador
    const [countdown, setCountdown] = useState(0);
    // Variable para saber si el contador está activo
    const isCountdownActive = countdown > 0;

    // 3. useEffect para manejar la lógica del contador
    useEffect(() => {
        // Si el contador no está activo, no hacemos nada
        if (!isCountdownActive) return;

        // Configuramos un intervalo que se ejecuta cada segundo
        const intervalId = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);

        // Función de limpieza:
        // Se ejecuta cuando el contador llega a 0 o el componente se desmonta
        return () => clearInterval(intervalId);

    }, [isCountdownActive]); // Este efecto depende de si el contador está activo

    // 4. Creamos nuestro propio manejador de 'submit'
    const localHandleSubmit = (e) => {
        // Prevenimos que el formulario se envíe si el contador está activo
        if (isCountdownActive) {
            e.preventDefault();
            return;
        }
        
        // Llamamos a la función original del hook
        handleForgotSubmit(e);
        
        // Iniciamos el contador en 60 segundos
        setCountdown(60);
    };

    return (
        <div className="forgot-container">
            <div className="forgot-form">
                <img className="login-logo" src="/tuticket_logo.png" alt="TuTicket Logo" />
                <h2>Recuperar contraseña</h2>
                <p>Ingresa tu correo electrónico para recibir un enlace de recuperación.</p>

                {/* Usamos nuestro manejador local */}
                <form onSubmit={localHandleSubmit}>
                    <input
                        type="email"
                        className="input-form"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        // Deshabilitado si está cargando O si el contador está activo
                        disabled={isLoading || isCountdownActive}
                    />
                                    
    
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-lg mt-3" 
                        // Deshabilitado si está cargando O si el contador está activo
                        disabled={isLoading || isCountdownActive}
                    >
                        {/* Mostramos el texto según el estado:
                          1. Si el contador está activo: "Reenviar en XXs"
                          2. Si está cargando: "Enviando..."
                          3. Por defecto: "Enviar enlace"
                        */}
                        {isCountdownActive
                            ? `Reenviar en ${countdown}s`
                            : isLoading
                                ? "Enviando..."
                                : "Enviar enlace"
                        }
                    </button>                    
                    <button
                        type="button"
                        className="btn btn-secondary btn-lg mt-3"
                        onClick={() => navigate("/login")}
                    >
                        Volver al login
                    </button>
                </form>
            </div>
        </div>
    );
};