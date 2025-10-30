import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCiudades } from '../../../globalServices/CiudadService';
import { postClient } from '../../../globalServices/ClienteService';
import { NavLink } from 'react-router-dom'

export const Register = () => {
    const response = useNavigate(); /*Hook que permite redirigir al presionar el boton*/
    const [selectedCiudad, setSelectedCiudad] = useState("Seleccionar ciudad");
    const [ciudad, setCiudad] = useState([]);

    // Fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

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
        rol: "CLIENTE",
        fechaNacimiento: today  
    });

    // Para validar confirmación de contraseña
    const [confirmPassword, setConfirmPassword] = useState("");

    const { nombre, apellido, email, hashCtr, telefono, dni, fechaNacimiento } = newClient;

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

    // Validaciones simples
    const validar = () => {
        const emailOk = /^\S+@\S+\.\S+$/.test((email || '').trim());
        const dniOk = /^\d{8}$/.test((dni || '').trim());
        const celOk = /^\d{9}$/.test((telefono || '').trim());
        const passOk = (hashCtr || '').length >= 8;
        const passMatch = hashCtr === confirmPassword;
        const ciudadOk = !!newClient.ciudad.idCiudad;
        const fechaOk = !!fechaNacimiento && fechaNacimiento <= today;

        if (!(nombre || '').trim()) return 'El nombre es obligatorio.';
        if (!(apellido || '').trim()) return 'El apellido es obligatorio.';
        if (!emailOk) return 'Ingresa un correo válido.';
        if (!passOk) return 'La contraseña debe tener al menos 8 caracteres.';
        if (!passMatch) return 'Las contraseñas no coinciden.';
        if (!dniOk) return 'El DNI debe tener 8 dígitos.';
        if (!celOk) return 'El celular debe tener 9 dígitos.';
        if (!fechaOk) return 'Selecciona una fecha de nacimiento válida.';
        if (!ciudadOk) return 'Debes seleccionar una ciudad.';
        return null;
    };

    const formCreateNewClient = async (event) => {
        event.preventDefault();

        const error = validar();
        if (error) {
            alert(error);
            return;
        }

        
        const payload = {
            nombre: (nombre || '').replace(/\s+/g, ' ').trim(),
            apellido: (apellido || '').replace(/\s+/g, ' ').trim(),
            email: (email || '').trim().toLowerCase(),
            hashCtr, // el backend debe hashear
            verificado: false,
            telefono: (telefono || '').replace(/\D/g, ''), // solo dígitos
            activo: true,
            ciudad: { idCiudad: newClient.ciudad.idCiudad },
            dni: (dni || '').replace(/\D/g, ''), // solo dígitos
            rol: "CLIENTE",
            fechaNacimiento
        };

        try {
            await postClient(payload); // Llamo al service
            alert("Cliente registrado correctamente");
            response("/home"); // Redirige al home
        } catch (error) {
            alert("Hubo un error: " + error.message);
        }

        // Reset
        setNewClient({
            nombre: "",
            apellido: "",
            email: "",
            hashCtr: "",
            verificado: false,
            telefono: "",
            activo: true,
            ciudad: { "idCiudad": null },
            dni: "",
            rol: "CLIENTE",
            fechaNacimiento: today 
        });
        setConfirmPassword("");
        setSelectedCiudad("Seleccionar ciudad");
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
                                    style={{ background: "#EBF5EB" }}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)} />
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

                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpFechaNac" className='text-start'>Fecha de nacimiento</label>
                                <input
                                    className='form-control border-0'
                                    type="date"
                                    id='inpFechaNac'
                                    name='fechaNacimiento'
                                    value={fechaNacimiento}
                                    max={today}
                                    style={{ background: "#EBF5EB" }}
                                    onChange={manejarNuevoUsuario}
                                />
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