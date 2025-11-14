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
    // Aqui se modifico ya no se pasa TRUE O FALSE, SE PASA EL USUARIO COMPLETO
    // PARA PODER VALIDAR SU ROL
    const handleLoginSubmit = async () => {
        if (!validateForm()) return null;

        setIsLoading(true);
        clearMessage();

        try {
            const response = await fetch('https://api.tuticket.space/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const result = await response.json();
            // TEMP: mirar qué llega del back
            console.log("LOGIN NORMAL RESULT =>", result);

            if (!response.ok) {
                showMessage(result.message || 'Correo o contraseña incorrectos.', 'error');
                return null;
            }

            const decoded = jwtDecode(result.token);

            const user = {
                idUsuario: result.idUsuario,
                email: result.email,
                rol: result.rol,
                nombre: result.nombre,
                apellido: result.apellido,
                telefono: result.telefono,        // <-- NUEVO
                ciudad: result.ciudad,            // <-- NUEVO
                departamento: result.departamento // <-- NUEVO
            };

            login(user, result.token, decoded.exp);
            showMessage(result.message || '¡Inicio de sesión exitoso!', 'success');
            return user;

        } catch (error) {
            showMessage('Error de conexión. Por favor, intenta nuevamente.', 'error');
            return null;
        } finally {
            setIsLoading(false);
        }
    };


    // Para manejar el login con Google
    const handleGoogleLogin = async (credentialResponse) => {
        const idToken = credentialResponse.credential;

        setIsLoading(true);
        clearMessage();

        try {
            const response = await fetch('https://api.tuticket.space/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });

            const result = await response.json();
            console.log("LOGIN GOOGLE RESULT =>", result);

            if (!response.ok) {
                showMessage(result.message || 'Error en el login con Google.', 'error');
                return null;
            }

            const decoded = jwtDecode(result.token);

            const user = {
                idUsuario: result.idUsuario,
                email: result.email,
                rol: result.rol,
                nombre: result.nombre,
                apellido: result.apellido,
                telefono: result.telefono,        // <-- NUEVO
                ciudad: result.ciudad,            // <-- NUEVO
                departamento: result.departamento // <-- NUEVO
            };

            login(user, result.token, decoded.exp);
            showMessage(result.message || '¡Inicio de sesión exitoso!', 'success');
            return user;

        } catch (error) {
            console.error("Error en handleGoogleLogin:", error);
            showMessage('Error de conexión con Google. Intenta nuevamente.', 'error');
            return null;
        } finally {
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
        handleGoogleLogin, // La función para el login con Google
    };
};