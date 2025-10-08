import { useState } from 'react';
import { useAuth } from "../context/AuthContext"

import { apiFetch } from './API';

export const useTicketPurchase = (idevento) => {
    const [formData, setFormData] = useState({discount: ''});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [zonas, setZonas] = useState([]);
    const [temporadas, setTemporadas] = useState([]);
    const { user } = useAuth();
    const token = user.bearer;
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    //Fetch de zonas por evento
    const fetchZonas = async () => {
        const data = await apiFetch(`/api/zona/evento/${idevento}`);
        setZonas(data || []);
    };
    //Fetch de temporadas por evento
    const fetchTemporadas = async () => {
        const data = await apiFetch(`/api/temporada/evento/${idevento}`);
        setTemporadas(data || []);
    };



    return {
        formData,
        errors,
        isLoading,
        message,
        zonas,
        temporadas,
        handleInputChange,
        fetchZonas,
        fetchTemporadas
    };
}