import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "../service/useForgotPassword";
import "./ForgotPassword.css";

export const ForgotPassword = () => {

    const navigate = useNavigate();

    const {
        email,
        isLoading,
        handleSubmit,
        setEmail
     } = useForgotPassword();

    return (
        <div className="forgot-container">
            <div className="forgot-form">
                <img className="login-logo" src="/tuticket_logo.png" alt="TuTicket Logo" />
                <h2>Recuperar contraseña</h2>
                <p>Ingresa tu correo electrónico para recibir un enlace de recuperación.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="input-form"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    
                    <button
                        type="button"
                        className="btn btn-secondary btn-lg mt-3"
                        onClick={() => navigate("/login")}
                    >
                        Volver al login
                    </button>
    
                    <button type="submit" className="btn btn-primary btn-lg mt-3" disabled={isLoading}>
                        {isLoading ? "Enviando..." : "Enviar enlace"}
                    </button>                    

                </form>
            </div>
        </div>
    );
};
