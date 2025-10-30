import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext'; //Importa el hook de autenticación
import { jwtDecode } from 'jwt-decode';


export const loginService = () => {

    const { login } = useAuth(); //Obtenemos la función login del contexto
    // --- ESTADOS DEL FORMULARIO ---
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // --- MANEJO DE INPUTS Y MENSAJES ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Limpiar error del campo al empezar a escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const showMessage = (text, type = '') => {
        setMessage({ text, type });
    };

    const clearMessage = () => {
        setMessage({ text: '', type: '' });
    };

    // --- VALIDACIÓN DEL FORMULARIO ---
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- LÓGICA DE LOGIN CON FETCH (Anteriormente en loginService.js)
    const handleLoginSubmit = async () => {
        // 1. Validar el formulario antes de enviar
        if (!validateForm()) {
            return false; // Indica que el envío falló por validación
        }
        //Iniciar estado de carga y limpiar mensajes previos
        setIsLoading(true);
        clearMessage();

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                showMessage(result.message || 'Correo o contraseña incorrectos.', 'error');
                return false; // Indica que el login falló
            }
            // COSAS NUEVAS
            const decoded = jwtDecode(result.token); //Se decodifica el token                   
            const user  = {
                idUsuario:result.idUsuario,
                email:    result.email,
                rol:      result.rol,
                nombre:   result.nombre,
                apellido: result.apellido,
            };            
            //
            login(user, result.token ,decoded.exp); //Cambio acá también
            showMessage(result.message || '¡Inicio de sesión exitoso!', 'success');
            return true;

        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            //Capturar errores de red o de la petición
            showMessage('Error de conexión. Por favor, intenta nuevamente.', 'error');
            return false; // Indica que el login falló
        } finally {
            //Detener el estado de carga
            setIsLoading(false);
        }
    };
    
    // --- VALORES Y FUNCIONES RETORNADOS POR EL HOOK ---
    return {
        formData,
        errors,
        isLoading,
        message,
        handleInputChange,
        handleLoginSubmit, // La nueva función que el componente usará para el submit
    };
};