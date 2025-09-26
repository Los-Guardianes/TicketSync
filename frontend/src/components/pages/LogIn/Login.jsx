import "./Login.css"
import { NavLink } from 'react-router-dom'

export const Login = () => {
  return (
    <>
      <div className='login-container'>
        <div className='login-form'>
          <img className='login-logo' src="/tuticket_logo.png" alt="TuTicket Logo" />
          <h2>Iniciar sesión</h2>
          <form className="login-inputs">
              <label htmlFor="inpEmail"></label>
              <input className='input-form' type="email" id='inpEmail' placeholder="Correo electrónico"/>
              <label htmlFor="inpPassword"></label>
              <input className='input-form' type="password" id='inpPassword' placeholder="Contraseña"/>
              <p>Correo o contraseña incorrectos. Intente de nuevo.</p>
          </form>
          <a className="forgot-password" href="#">¿Olvidaste tu contraseña?</a>
          <a href="/" className='btn btn-primary btn-lg mt-3'>Iniciar sesión</a>
          <hr className='my-3' />
          <a href="/register" className='btn btn-secondary btn-lg mt-3'>Registrate</a>
          <button className='btn btn-secondary btn-lg mt-3 justify-content-center d-flex align-items-center'>
            <img src="/icon_google.svg" alt="Google Logo" style={{ width: '20px', marginRight: '8px' }} />
            O registrate con Google
          </button>
        </div>
      </div>
    </>
  )
}
