import { useState } from 'react';
import { getEventosById } from "../services/EventoService";
import { useAuth } from "../context/AuthContext"

import { apiFetch } from './API';

export const useTicketPurchase = (idevento) => {

    const [formData, setFormData] = useState({discount: ''});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [zonas, setZonas] = useState([]);
    const [temporadas, setTemporadas] = useState([]);
    const [funciones, setFunciones] = useState([]);
    const [evento, setEvento] = useState(null); 
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const fetchEvento = async () => {
        const data = await getEventosById(idevento);
        setEvento(data);
    };

    const fetchZonas = async () => {
        const data = await apiFetch(`/api/zona/evento/${idevento}`);
        setZonas(data || []);
    };

    const fetchTemporadas = async () => {
        const data = await apiFetch(`/api/temporada/evento/${idevento}`);
        setTemporadas(data || []);
    };

    const fetchFunciones = async () => {
        const data = await apiFetch(`/api/funcion/evento/${idevento}`);
        console.log(data);
        setFunciones(data || []);
    }

    return {
        formData,
        errors,
        isLoading,
        message,
        zonas,
        temporadas,
        evento,
        funciones,
        handleInputChange,
        fetchZonas,
        fetchTemporadas,
        fetchEvento,
        fetchFunciones
    };
}