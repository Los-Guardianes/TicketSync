import "./Login.css"
import { useNavigate } from 'react-router-dom';
import { useLogin } from './useLogin';
import { loginService } from './loginService';

export const Login = () => {

  const navigate = useNavigate();
    const {
        formData,
        errors,
        isLoading,
        message,
        validateForm,
        handleInputChange,
        setIsLoading,
        showMessage,
        clearMessage
    } = useLogin();


  const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        clearMessage();

        try {
            const result = await loginService.login(formData.email, formData.password);
            
            if (result.success) {
                showMessage(result.message, 'success');
                
                // Redirigir a la página principal después de 2 segundos
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                showMessage(result.message, 'error');
            }
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
            showMessage('Error al iniciar sesión. Por favor, intenta nuevamente.', 'error');
        } finally {
            setIsLoading(false);
        }
    };


  const handleGoogleLogin = () => {
        // Simular inicio de sesión con Google

        // En un caso real, aquí redirigirías a la autenticación de Google
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
          <form className="login-inputs" onSubmit={handleLogin}>
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
