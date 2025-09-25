import React from 'react'

export const Login = () => {
  return (
    <>
      <div className='w-100'>
        <img className='w-100 position-absolute h-100' src="src/assets/wallhaven-4gjdrd.jpg"
          alt="tuticketLogo" />
        <div className='container px-5 py-4 bg-light position-relative shadow rounded'>
          <h2 className='text-center'>Iniciar sesion</h2>
          <form>
            <div className='form-group row mx-auto d-flex align-items-center'>
              <label htmlFor="inpEmail" className='col-2 text-start'>Dirección de correo electronico</label>
              <div className='col-7'>
                <input className='form-control col-7' type="email" id='inpEmail' />
              </div>
              <p className='col text-end'>
                <span className='text-danger h5'>*</span>La dirección de correo electrónico
                es su nombre de usuario
              </p>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}
