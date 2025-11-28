import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import { useRegister } from "./service/useRegister";
import { DropdownList } from '../../common/DropDownList/DropDownList';

export const Register = () => {
    const {
        ciudades,
        selectedCiudad,
        formUsuario,
        seleccionarCiudad,
        handleUserForm,
        handleSubmit
    } = useRegister("CLIENTE")


    return (
        <div className='row min-vh-100 w-100 mx-0'>
            <div className='col-6 px-5 py-4 bg-light shadow rounded'>
                <div className='w-100 m-0 p-0 d-flex justify-content-center'>
                    <img src="https://tuticket-bucket.s3.us-east-1.amazonaws.com/TUTICKET_PNG_SIN_ESPACIOS.png"
                        alt="tuticketLogo" style={{ width: "10rem" }} />
                </div>
                <h2 className='text-center mt-4 mb-4' style={{ color: "#2EA062" }}>Bienvenidos a tu ticket</h2>
                <form onSubmit={handleSubmit}>
                    <div className='d-grid gap-2 form-group container mx-auto'>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpNombre" className='col-3 text-start'>Nombre</label>
                                <input className='form-control border-0'
                                    type="text" id='inpNombre' placeholder='Ingrese su nombre' name='nombre'
                                    value={formUsuario.nombre} style={{ background: "#EBF5EB" }} onChange={handleUserForm} />
                            </div>
                            <div className='col'>
                                <label htmlFor="inpApellido" className='col-3 text-start'>Apellido</label>
                                <input className='form-control border-0'
                                    type="text" id='inpApellido' placeholder='Ingrese su apellido' name='apellido'
                                    value={formUsuario.apellido} style={{ background: "#EBF5EB" }} onChange={handleUserForm} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpEmail" className='col-3 text-start'>Correo</label>
                                <input className='form-control border-0' type="email" autoComplete='email'
                                    id='inpEmail' placeholder='Ingrese un correo electronico' name='email'
                                    value={formUsuario.email}
                                    style={{ background: "#EBF5EB" }} onChange={handleUserForm} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpPassword" className='col-3 text-start'>Contraseña</label>
                                <input className='form-control border-0' type="password"
                                    id='inpPassword' placeholder='Ingrese una contraseña' name='hashCtr' autoComplete='new-password'
                                    value={formUsuario.hashCtr} style={{ background: "#EBF5EB" }} onChange={handleUserForm} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpConfirmPassword" className='col-3 text-start'>Confirmar contraseña</label>
                                <input className='form-control border-0' type="password"
                                    id='inpConfirmPassword' placeholder='Confirme su contraseña' autoComplete='new-password'
                                    name='confirmPassword'
                                    style={{ background: "#EBF5EB" }}
                                    value={formUsuario.confirmPassword}
                                    onChange={handleUserForm} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpDNI" className='text-start'>DNI</label>
                                <input className='form-control border-0' type="text"
                                    id='inpDNI' placeholder='Ingrese su número de indetidad' name='dni'
                                    value={formUsuario.dni} style={{ background: "#EBF5EB" }} onChange={handleUserForm} />
                            </div>
                            <div className='col'>
                                <label htmlFor="inpCelular" className='text-start'>Celular</label>
                                <input className='form-control border-0' type="text"
                                    id='inpCelular' placeholder='Ingrese su número celular' name='telefono'
                                    value={formUsuario.telefono} style={{ background: "#EBF5EB" }} onChange={handleUserForm} />
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpFechaNac" className='text-start'>Fecha de nacimiento</label>
                                <input
                                    className='form-control border-0'
                                    type="date"
                                    id='inpFechaNac'
                                    name='fechaNacimiento'
                                    value={formUsuario.fechaNacimiento}
                                    max={new Date()}
                                    style={{ background: "#EBF5EB" }}
                                    onChange={handleUserForm}
                                />
                            </div>
                        </div>

                        <div className='row d-flex align-items-center mt-2'>
                            <p className="col-2 text-start">Ciudad</p>
                            <div className="col">
                                <div className="dropdown">
                                    <DropdownList
                                        firstElement={"Selecciona una ciudad"}
                                        list={ciudades}
                                        id={"idCiudad"}
                                        value={selectedCiudad ? selectedCiudad.idCiudad : ""}
                                        onChangeOption={seleccionarCiudad}
                                        getNombre={(ciudad) => {
                                            return ciudad.nombre
                                        }}
                                    >
                                    </DropdownList>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container mx-auto mt-3 mb-5'>
                        <div className='form-check' style={{ color: "#919191" }}>
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckTermino"></input>
                            <p className='m-0'>He leído y aceptado los Términos y Condiciones y la Política de Privacidad *.</p>
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckAdicional"></input>
                            <p className='m-0'>Doy mi consentimiento para usos adicionales y disfrutar de los beneficios, promociones y descuentos creados para mí.</p>
                        </div>
                    </div>
                    <div className='container w-100 d-flex justify-content-between gap-5'>
                        <NavLink to="/" className="btn btn-dark">
                            Regresar
                        </NavLink>
                        <button className="btn btn-success" type="submit">
                            Registrar
                        </button>
                    </div>

                </form>

            </div>
            <div className='p-0 m-0 col-6'>
                <img className='h-100 w-100' src="https://tuticket-bucket.s3.us-east-1.amazonaws.com/wallhaven-4gjdrd.jpg"
                    alt="tuticketLogo" style={{ height: "100%", minHeight: "100vh", objectFit: "cover" }} />
            </div>
        </div>
    )
}