import "./Login.css";
import { useNavigate } from 'react-router-dom';
import { loginService } from '../../../services/loginService'; // Única importación de lógica

export const Login = () => {
    const navigate = useNavigate();

    // El hook ahora provee toda la lógica necesaria
    const {
        formData,
        errors,
        isLoading,
        message,
        handleInputChange,
        handleLoginSubmit // La función que maneja la validación y el fetch
    } = loginService();

    // El manejador del formulario en el componente se vuelve muy simple
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Llama a la función del hook que hace todo el trabajo
        const loginSuccess = await handleLoginSubmit();
        
        // Si el hook indica que el login fue exitoso, entonces navegamos
        if (loginSuccess) {
            setTimeout(() => {
                navigate('/');
            }, 2000); // Redirigir tras 2 segundos
        }
    };

    const handleGoogleLogin = () => {
        // Lógica de Google sin cambios...
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
                    
                    {/* El onSubmit ahora llama a nuestra nueva función simple */}
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
                </div>
            </div>
        </>
    )
}