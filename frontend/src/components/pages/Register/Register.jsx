import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCiudades } from '../../../services/CiudadService';
import { postClient } from '../../../services/ClienteService';
import { NavLink } from 'react-router-dom'

export const Register = () => {
    const response = useNavigate(); /*Hook que permite redirigir al presionar el boton*/
    const [selectedCiudad, setSelectedCiudad] = useState("Seleccionar ciudad");
    const [ciudad, setCiudad] = useState([]);
    const [newClient, setNewClient] = useState({
        nombre: "",
        apellido: "",
        email: "",
        hashCtr: "",
        verificado: false,
        telefono: "",
        activo: true,
        ciudad: {
            "idCiudad": null
        },
        dni: "",
        fechaNacimiento: "2000-05-15"
    });

    // Saco las variables importantes de nuevo cliente, aca se guardan los values de input
    const { nombre, apellido, email, hashCtr, telefono, dni } = newClient;

    // Al momento de iniciar la pagina (primera vez) se ejecuta el get de las ciudades
    useEffect(() => {
        const getCiudad = async () => {
            const data = await getCiudades();
            setCiudad(data);
        };
        getCiudad();
    }, []);

    //Este es quien modifica al instante cada vez que se agregue algo en el input
    const manejarNuevoUsuario = ({ target: { name, value } }) => {
        // Hace une nueva copia y cada nuevo valor es 
        // reemplazado por cada vez que cambie el input
        setNewClient({ ...newClient, [name]: value });
    }

    const formCreateNewClient = async (event) => {
        event.preventDefault();
        // Aqui hago el fetch para hacer post
        //Aquí deben ir validaciones
            // Validación ciudad
        if (!newClient.ciudad.idCiudad) {
            alert("Debe seleccionar una ciudad");
            return;
        }
        try {
            await postClient(newClient); // Llamo al service
            alert("Cliente registrado correctamente");
            response("/home"); // Redirige al home
        } catch (error) {
            alert("Hubo un error: " + error.message);
        }

        // Vuelvo a colocar en blanco todos los 
        // casilleros una vez que se envia el form
        setNewClient({
            nombre: "",
            apellido: "",
            email: "",
            hashCtr: "",
            verificado: false,
            telefono: "",
            activo: true,
            ciudad: {
                "idCiudad": null
            },
            dni: "",
            fechaNacimiento: "2000-05-15" //Cambiar, colocar un nuevo input
        });
    }

    return (
        <div className='row vh-100 w-100 mx-0' style={{ overflow: "hidden" }}>
            <div className='col-6 px-5 py-4 bg-light shadow rounded'>
                <div className='w-100 m-0 p-0 d-flex justify-content-center'>
                    <img src="https://tuticket-bucket.s3.us-east-1.amazonaws.com/TUTICKET_PNG_SIN_ESPACIOS.png"
                        alt="tuticketLogo" style={{ width: "10rem" }} />
                </div>
                <h2 className='text-center mt-4 mb-4' style={{ color: "#2EA062" }}>Bienvenidos a tu ticket</h2>
                <form onSubmit={formCreateNewClient}>
                    <div className='d-grid gap-2 form-group container mx-auto'>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpNombre" className='col-3 text-start'>Nombre</label>
                                <input className='form-control border-0'
                                    type="text" id='inpNombre' placeholder='Ingrese su nombre' name='nombre'
                                    value={nombre} style={{ background: "#EBF5EB" }} onChange={manejarNuevoUsuario} />
                            </div>
                            <div className='col'>
                                <label htmlFor="inpApellido" className='col-3 text-start'>Apellido</label>
                                <input className='form-control border-0'
                                    type="text" id='inpApellido' placeholder='Ingrese su apellido' name='apellido'
                                    value={apellido} style={{ background: "#EBF5EB" }} onChange={manejarNuevoUsuario} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpEmail" className='col-3 text-start'>Correo</label>
                                <input className='form-control border-0' type="email"
                                    id='inpEmail' placeholder='Ingrese un correo electronico' name='email'
                                    value={email}
                                    style={{ background: "#EBF5EB" }} onChange={manejarNuevoUsuario} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpPassword" className='col-3 text-start'>Contraseña</label>
                                <input className='form-control border-0' type="password"
                                    id='inpPassword' placeholder='Ingrese una contraseña' name='hashCtr'
                                    value={hashCtr} style={{ background: "#EBF5EB" }} onChange={manejarNuevoUsuario} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpConfirmPassword" className='col-3 text-start'>Confirmar contraseña</label>
                                <input className='form-control border-0' type="password"
                                    id='inpConfirmPassword' placeholder='Confirme su contraseña'
                                    style={{ background: "#EBF5EB" }} onChange={manejarNuevoUsuario} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpDNI" className='text-start'>DNI</label>
                                <input className='form-control border-0' type="text"
                                    id='inpDNI' placeholder='Ingrese su número de indetidad' name='dni'
                                    value={dni} style={{ background: "#EBF5EB" }} onChange={manejarNuevoUsuario} />
                            </div>
                            <div className='col'>
                                <label htmlFor="inpCelular" className='text-start'>Celular</label>
                                <input className='form-control border-0' type="text"
                                    id='inpCelular' placeholder='Ingrese su número celular' name='telefono'
                                    value={telefono} style={{ background: "#EBF5EB" }} onChange={manejarNuevoUsuario} />
                            </div>
                        </div>
                        <div className='row d-flex align-items-center mt-2'>
                            <label htmlFor="inpCiudad" className="col-2 text-start">Ciudad</label>
                            <div className="col">
                                <div className="dropdown">
                                    <button className="btn btn-light dropdown-toggle " style={{ background: "#EBF5EB" }}
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        {selectedCiudad}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {ciudad.map((itemCiudad) => (
                                            <li key={itemCiudad.idCiudad}>
                                                <a className="dropdown-item" href="#"
                                                onClick={() => {
                                                    setSelectedCiudad(itemCiudad.nombre);
                                                    setNewClient({
                                                        ...newClient,
                                                        ciudad: { idCiudad: itemCiudad.idCiudad }
                                                    });
                                                }}>
                                                    {itemCiudad.nombre}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
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
                    <div className='container w-100 d-flex justify-content-between'>
                        <NavLink className={'btn btn-dark'} to={"/"} >Regresar</NavLink>
                        <button className='btn btn-success' type='submit'>Registrar</button>
                    </div>
                </form>

            </div>
            <div className='p-0 m-0 col-6'>
                <img className='h-100 w-100' src="https://tuticket-bucket.s3.us-east-1.amazonaws.com/wallhaven-4gjdrd.jpg"
                    alt="tuticketLogo" style={{ maxHeight: "100vh", objectFit: "cover" }} />
            </div>
        </div>
    )
}