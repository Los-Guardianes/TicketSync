import { data, useNavigate } from "react-router-dom";
import { useState } from "react";
import {useNotification} from "../../../../context/NotificationContext"
import { apiFetch } from "../../../../globalServices/API";
export const useForgotPassword = () =>{

    
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { 
        showNotification 
    } = useNotification()

    const postForgotPassword = (email) =>
        apiFetch('/api/forgot-password', {method: 'POST',body: JSON.stringify({email}) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);        
        try {
            await postForgotPassword(email); // No necesitas await doble ni revisar ok
            showNotification("Se ha enviado un enlace a tu correo electrónico.", "success");
        } catch (error) {
            showNotification("No se pudo enviar el correo a: " + email, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return{
        email,    
        isLoading,
        handleSubmit,
        setEmail
    }
}