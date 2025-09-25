import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Register = () => {
    const response = useNavigate(); /*Hook que permite redirigir al presionar el boton*/

    const btnSuccess = () => {
        response("/home");
    }
    return (
        <div className='container px-5 py-4 bg-light position-relative shadow rounded'>
            <h2 className='text-center'>Bienvenidos a tu ticket</h2>
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
                <div className='row d-flex align-items-center'>
                    <div className='col'>
                        <div className='form-group row mx-auto my-4 d-flex align-items-center'>
                            <label htmlFor="inpPassword" className='col-3 text-start'>Contraseña</label>
                            <input className='form-control col' type="password" id='inpPassword' />
                        </div>
                        <div className='form-group row mx-auto my-4 d-flex align-items-center'>
                            <label htmlFor="inpConfirmPassword" className='col-3 text-start'>Confirmar Contraseña</label>
                            <input className='form-control col' type="password" id='inpConfirmPassword' />
                        </div>
                    </div>
                    <p className='col-3 text-end'>
                        <span className='text-danger h5'>*</span>Las  contraseñas deben contener por lo
                        menos un número y un carácter  especial, incluir letras en mayúscula
                        y minúscula, y tener una longitud  mínima de 8 caracteres.
                    </p>
                </div>
                <div className='form-group row my-3 mx-auto d-flex align-items-center'>
                    <label htmlFor="inpNombre" className='col-2 text-start'>Nombre</label>
                    <div className='col-7'>
                        <input className='form-control col-7' type="email" id='inpNombre' />
                    </div>
                </div>
                <div className='form-group row my-3 mx-auto d-flex align-items-center'>
                    <label htmlFor="inpApPaterno" className='col-2 text-start'>Apellido Paterno</label>
                    <div className='col-7'>
                        <input className='form-control col-7' type="email" id='inpApPaterno' />
                    </div>
                </div>
                <div className='form-group row my-3 mx-auto d-flex align-items-center'>
                    <label htmlFor="inpApMaterno" className='col-2 text-start'>Apellido Materno</label>
                    <div className='col-7'>
                        <input className='form-control col-7' type="email" id='inpApMaterno' />
                    </div>
                </div>
            </form>
            <div className='row d-flex align-items-center mt-5 border-top'>
                <div className='col my-4'>
                    <p className='text-start'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium maiores reiciendis, earum provident molestiae tempore quam quia quaerat deserunt doloribus error, quae iusto voluptates ea, voluptatem exercitationem eligendi quis! Est?
                    </p>
                </div>
                <div className='col-2'>
                    <button className='btn btn-primary' onClick={btnSuccess}>Crear Cuenta</button>
                </div>
            </div>
        </div>
    )
}
