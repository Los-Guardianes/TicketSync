import "./Login.css";
import { useNavigate } from 'react-router-dom';
import { loginService } from '../service/loginService'; // Única importación de lógica
import { GoogleLogin } from '@react-oauth/google';

export const Login = () => {
    const navigate = useNavigate();

    // Lógica del servicio
    const {
        formData,
        errors,
        isLoading,
        message,
        handleInputChange,
        handleLoginSubmit,
        handleGoogleLogin,
    } = loginService();

    // Función de ayuda para la navegación (REUTILIZABLE)
    const handleNavigation = (rol) => {
        if (rol === 'ADMINISTRADOR') {
            navigate('/home-admin');
        } else {
            navigate('/');
        }
    };

    // Submit del formulario
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const loginSuccess = await handleLoginSubmit();

        if (loginSuccess) {
            handleNavigation(loginSuccess.rol); // Usa la función de navegación
        }
    };

    // Para google
    // Wrapper para el onSuccess de Google
    const onGoogleSuccess = async (credentialResponse) => {
        // Llama a la función del hook
        const loginSuccess = await handleGoogleLogin(credentialResponse);

        //  Reutiliza la misma lógica de navegación
        if (loginSuccess) {
            handleNavigation(loginSuccess.rol);
        }
    };

    // Wrapper para el onError de Google
    const onGoogleError = () => {
        console.error("Login con Google fallido");
        // 'loginService' ya muestra el mensaje de error en la UI
    };

    return (
        <>
            <div className='login-container'>
                <div className='login-form'>
                    <img className='login-logo' src="/tuticket_logo.png" alt="TuTicket Logo" />
                    <h2>Iniciar sesión</h2>

                    {/* Formulario */}
                    <form className="login-inputs" onSubmit={handleFormSubmit}>
                        <input
                            className={`input-form ${errors.email ? 'error' : ''}`}
                            type="email"
                            name='email'
                            placeholder="Correo electrónico"
                            maxLength={100}
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.email && <div className="error-form">{errors.email}</div>}

                        <input
                            className={`input-form ${errors.password ? 'error' : ''}`}
                            type="password"
                            name='password'
                            placeholder="Contraseña"
                            maxLength={100}
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />
                        {errors.password && <div className="error-form">{errors.password}</div>}

                        <a className="link-form forgot-password" href="#">¿Olvidaste tu contraseña?</a>

                        {message.text && (
                            <div className={`message ${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            className='btn btn-primary btn-lg mt-3'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    <hr className='my-3' />

                    <a href="/register" className='btn btn-secondary btn-lg mt-3'>Registrate</a>

                    {/* botón de Google por el componente */}
                    <div className="mt-3">
                        <GoogleLogin
                            onSuccess={onGoogleSuccess}
                            onError={onGoogleError}
                            text="continue_with"
                            useOneTap={false}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="button"
                        className="btn btn-secondary btn-lg mt-3"
                        onClick={() => navigate('/home')}
                    >
                        Volver al inicio
                    </button>


                </div>
            </div>
        </>
    )
}
