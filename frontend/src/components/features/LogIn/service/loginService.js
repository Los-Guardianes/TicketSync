import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext'; //Importa el hook de autenticación
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from '../../../../globalServices/API';

export const loginService = () => {

    // NOTA: La URL se gestiona desde el archivo API.js importado arriba

    const { login } = useAuth(); //Obtenemos la función login del contexto

    // --- ESTADOS DEL FORMULARIO ---
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
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

    // --- LÓGICA DE LOGIN CON FETCH ---
    const handleLoginSubmit = async () => {
        if (!validateForm()) return null;

        setIsLoading(true);
        clearMessage();

        try {
            // Uso de BASE_URL global
            const response = await fetch(`${BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const result = await response.json();
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
                telefono: result.telefono,
                ciudad: result.ciudad,
                departamento: result.departamento,
                verificado: result.verificado
            };

            login(user, result.token, decoded.exp, formData.rememberMe);
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
            // Uso de BASE_URL global
            const response = await fetch(`${BASE_URL}/api/auth/google`, {
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
                telefono: result.telefono,
                ciudad: result.ciudad,
                departamento: result.departamento,
                verificado: result.verificado
            };

            login(user, result.token, decoded.exp, true); // Google login siempre es "remember me"
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

    return {
        formData,
        errors,
        isLoading,
        message,
        handleInputChange,
        handleLoginSubmit,
        handleGoogleLogin,
    };
};