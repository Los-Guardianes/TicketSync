import "./Login.css";
import { useNavigate } from 'react-router-dom';
import { loginService } from '../service/loginService'; // Única importación de lógica

export const Login = () => {
    const navigate = useNavigate();

    // Lógica del servicio
    const {
        formData,
        errors,
        isLoading,
        message,
        handleInputChange,
        handleLoginSubmit
    } = loginService();

    const handleBackHome = () => {
        navigate('/home'); // si tu ruta de inicio es '/', cambia a navigate('/')
    };

    // Submit del formulario
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const loginSuccess = await handleLoginSubmit();
        if (loginSuccess) {
            if (loginSuccess.rol === 'ADMINISTRADOR') {
                navigate('/home-admin');
            } else {
                navigate('/');
            }
        }
    };

    const handleGoogleLogin = () => {
        setTimeout(() => {
            navigate('/verification');
        }, 1000);
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

                    <button
                        className='btn btn-secondary btn-lg mt-3 justify-content-center d-flex align-items-center'
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <img src="/icon_google.svg" alt="Google Logo" style={{ width: '20px', marginRight: '8px' }} />
                        O inicia sesión con Google
                    </button>

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
