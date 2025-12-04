import "./Login.css";
// 1. Importa 'useLocation'
import { useNavigate, useLocation } from 'react-router-dom';
import { loginService } from '../service/loginService';
import { GoogleLogin } from '@react-oauth/google';

export const Login = () => {
    const navigate = useNavigate();
    // 2. Obtén la 'location'
    const location = useLocation();

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

    const handleNavigation = (rol) => {
        /*
            De Rodrigo: Recordar que ProtectedRoute manda a login cuando no esta autenticado
            A su vez manda un state con los datos de a que página trataba de ir y de donde llegaba
            En caso la ruta la no este protegida (si se va al login manualmente) entonces ignorará todos los states
            Esto fue implementado para mejorar la usabilidad, ya que antes cuando el login siempre te enviaba al home si o si
        */
        const state = location.state || {};
        const fromPath = state.from || null;
        const fromData = state.data || {};
        const returnTo = fromData.returnTo || null; // ej: "/ticket-purchase/123"

        if (returnTo) {
            // Prioridad #1: Si existe un 'returnTo', volvemos a la página de selección.
            // (Usamos 'replace' para que el login no quede en el historial)
            navigate(returnTo, { replace: true });

        } else if (fromPath) {
            // Prioridad #2: Si no había 'returnTo' (ej: un usuario fue a /profile)
            // lo mandamos a 'fromPath'.
            navigate(fromPath, { replace: true });

        } else {
            // Prioridad #3: Si no había 'state' (el usuario fue a /login directamente)
            // usamos la lógica de roles.
            if (rol === 'ADMINISTRADOR') {
                navigate('/home-admin');
            } else {
                navigate('/');
            }
        }
    };

    // Submit del formulario
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const loginSuccess = await handleLoginSubmit(); // Esto devuelve el { user }

        if (loginSuccess) {
            handleNavigation(loginSuccess.rol); // Usa la función de navegación
        }
    };

    // Para google
    const onGoogleSuccess = async (credentialResponse) => {
        const loginSuccess = await handleGoogleLogin(credentialResponse); // Devuelve { user }

        if (loginSuccess) {
            handleNavigation(loginSuccess.rol);
        }
    };

    const onGoogleError = () => {
        console.error("Login con Google fallido");
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

                        <div className="remember-me-container">
                            <label className="remember-me-label">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={(e) => handleInputChange({ target: { name: 'rememberMe', value: e.target.checked } })}
                                    disabled={isLoading}
                                />
                                <span>Recordarme</span>
                            </label>
                        </div>

                        <a className="link-form forgot-password" onClick={() => navigate('/forgot-password')}>¿Olvidaste tu contraseña?</a>

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
                        onClick={() => navigate('/home')} // Asumo que '/home' es tu inicio público
                    >
                        Volver al inicio
                    </button>

                </div>
            </div>
        </>
    )
}