import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCiudades } from '../../../services/CiudadService';
import { postOrganizador } from '../../../services/OrganizadorService';
import { NavLink } from 'react-router-dom'

export const RegisterOrganizer = () => {
    const response = useNavigate(); 
    const [selectedCiudad, setSelectedCiudad] = useState("Seleccionar ciudad");
    const [ciudad, setCiudad] = useState([]);

    const [newOrganizer, setNewOrganizer] = useState({
        nombre: "",
        apellido: "",
        email: "",
        hashCtr: "",
        verificado: false,
        telefono: "",
        activo: true,
        ciudad: { "idCiudad": null },
        ruc: "",
        razonSocial: ""
    });

    // Para validar confirmación de contraseña
    const [confirmPassword, setConfirmPassword] = useState("");

    const { nombre, apellido, email, hashCtr, telefono, ruc, razonSocial } = newOrganizer;

    useEffect(() => {
        const getCiudad = async () => {
            const data = await getCiudades();
            setCiudad(data);
        };
        getCiudad();
    }, []);

    const manejarNuevoOrganizador = ({ target: { name, value } }) => {
        setNewOrganizer({ ...newOrganizer, [name]: value });
    }

    // Validaciones simples
    const validar = () => {
        const emailOk = /^\S+@\S+\.\S+$/.test((email || '').trim());
        const passOk = (hashCtr || '').length >= 8;
        const passMatch = hashCtr === confirmPassword;
        const rucOk = /^\d{11}$/.test((ruc || '').trim());
        const celOk = /^\d{9}$/.test((telefono || '').trim());
        const ciudadOk = !!newOrganizer.ciudad.idCiudad;

        if (!(nombre || '').trim()) return 'El nombre es obligatorio.';
        if (!(apellido || '').trim()) return 'El apellido es obligatorio.';
        if (!emailOk) return 'Ingresa un correo válido.';
        if (!passOk) return 'La contraseña debe tener al menos 8 caracteres.';
        if (!passMatch) return 'Las contraseñas no coinciden.';
        if (!rucOk) return 'El RUC debe tener 11 dígitos.';
        if (!(razonSocial || '').trim()) return 'La razón social es obligatoria.';
        if (!celOk) return 'El celular debe tener 9 dígitos.';
        if (!ciudadOk) return 'Debes seleccionar una ciudad.';
        return null;
    };

    const formCreateNewOrganizer = async (event) => {
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
            ciudad: { idCiudad: newOrganizer.ciudad.idCiudad },
            ruc: (ruc || '').replace(/\D/g, ''),           // solo dígitos
            razonSocial: (razonSocial || '').replace(/\s+/g, ' ').trim()
        };

        try {
            await postOrganizador(payload);
            alert("Organizador registrado correctamente");
            response("/home");
        } catch (error) {
            alert("Hubo un error: " + (error?.message || 'Error desconocido'));
        }

        setNewOrganizer({
            nombre: "",
            apellido: "",
            email: "",
            hashCtr: "",
            verificado: false,
            telefono: "",
            activo: true,
            ciudad: { "idCiudad": null },
            ruc: "",
            razonSocial: ""
        });
        setConfirmPassword("");
        setSelectedCiudad("Seleccionar ciudad");
    }

    return (
        <div className='row vh-100 w-100 mx-0' style={{ overflow: "hidden" }}>
            <div className='col-6 px-5 py-4 bg-light shadow rounded'>
                <div className='w-100 m-0 p-0 d-flex justify-content-center'>
                    <img src="src/assets/TUTICKET_PNG_SIN_ESPACIOS.png"
                        alt="tuticketLogo" style={{ width: "10rem" }} />
                </div>
                <h2 className='text-center mt-4 mb-4' style={{ color: "#2EA062" }}>Registro de organizador</h2>
                <form onSubmit={formCreateNewOrganizer}>
                    <div className='d-grid gap-2 form-group container mx-auto'>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpNombre" className='text-start'>Nombre</label>
                                <input className='form-control border-0'
                                    type="text" id='inpNombre' placeholder='Ingrese su nombre' name='nombre'
                                    value={nombre} style={{ background: "#EBF5EB" }} onChange={manejarNuevoOrganizador} />
                            </div>
                            <div className='col'>
                                <label htmlFor="inpApellido" className='text-start'>Apellido</label>
                                <input className='form-control border-0'
                                    type="text" id='inpApellido' placeholder='Ingrese su apellido' name='apellido'
                                    value={apellido} style={{ background: "#EBF5EB" }} onChange={manejarNuevoOrganizador} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpEmail" className='text-start'>Correo</label>
                                <input className='form-control border-0' type="email"
                                    id='inpEmail' placeholder='Ingrese un correo electronico' name='email'
                                    value={email}
                                    style={{ background: "#EBF5EB" }} onChange={manejarNuevoOrganizador} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpPassword" className='text-start'>Contraseña</label>
                                <input className='form-control border-0' type="password"
                                    id='inpPassword' placeholder='Ingrese una contraseña' name='hashCtr'
                                    value={hashCtr} style={{ background: "#EBF5EB" }} onChange={manejarNuevoOrganizador} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpConfirmPassword" className='text-start'>Confirmar contraseña</label>
                                <input className='form-control border-0' type="password"
                                    id='inpConfirmPassword' placeholder='Confirme su contraseña'
                                    style={{ background: "#EBF5EB" }}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpRUC" className='text-start'>RUC</label>
                                <input className='form-control border-0' type="text"
                                    id='inpRUC' placeholder='Ingrese su RUC' name='ruc'
                                    value={ruc} style={{ background: "#EBF5EB" }} onChange={manejarNuevoOrganizador} />
                            </div>
                            <div className='col'>
                                <label htmlFor="inpCelular" className='text-start'>Celular</label>
                                <input className='form-control border-0' type="text"
                                    id='inpCelular' placeholder='Ingrese su número celular' name='telefono'
                                    value={telefono} style={{ background: "#EBF5EB" }} onChange={manejarNuevoOrganizador} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="inpRazon" className='text-start'>Razón social</label>
                                <input className='form-control border-0' type="text"
                                    id='inpRazon' placeholder='Ingrese su razón social' name='razonSocial'
                                    value={razonSocial} style={{ background: "#EBF5EB" }} onChange={manejarNuevoOrganizador} />
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
                                                        setNewOrganizer({
                                                            ...newOrganizer,
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
                <img className='h-100 w-100' src="src/assets/wallhaven-4gjdrd.jpg"
                    alt="tuticketLogo" style={{ maxHeight: "100vh", objectFit: "cover" }} />
            </div>
        </div>
    )
}
