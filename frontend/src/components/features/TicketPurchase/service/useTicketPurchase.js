import { useState, useEffect } from 'react';
import { getEventosById } from "../../../../globalServices/EventoService";
import { useAuth } from "../../../../context/AuthContext"
import { apiFetch } from '../../../../globalServices/API';
import { Tarifa } from '../models/Tarifa';
import { Zona } from '../models/Zona';
import { TipoEntrada } from '../models/TipoEntrada';
export const useTicketPurchase = (idevento) => {

    const [formData, setFormData] = useState({discount: ''});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [periodo, setPeriodos] = useState([]);
    const [funciones, setFunciones] = useState([]);
    const [evento, setEvento] = useState(null); 
    const [tarifas, setTarifas] = useState([]);
    const [tipoEntradas, setTipoEntradas] = useState([]);
    const [zonas, setZonas] = useState([]);

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

    const fetchPeriodo = async () => {
        const data = await apiFetch(`/api/periodo/evento/${idevento}`);
        setPeriodos(data || []); // Corregí "strea" a "data"
        console.log("Periodos obtenidos:", data);
    };

    const fetchTarifas = async () => {
        const data = await apiFetch(`/api/tarifa/evento/${idevento}`);
        const tarifasParseadas = (data || []).map(t => Tarifa.fromApi(t));
        setTarifas(tarifasParseadas);
    };


    const fetchFunciones = async () => {
        const data = await apiFetch(`/api/funcion/evento/${idevento}`);
        setFunciones(data || []);
    }

    useEffect(() => {
        if (tarifas.length === 0) return;
        const zonasUnicas = tarifas.map(t => t.zona);
        const tiposUnicos = tarifas.map(t => t.tipoEntrada);
        setZonas(zonasUnicas);
        setTipoEntradas(tiposUnicos);
    }, [tarifas]);



    return {
        formData,
        errors,
        isLoading,
        message,
        zonas,
        periodo,
        evento,
        funciones,
        tipoEntradas,
        tarifas,
        handleInputChange,
        fetchPeriodo,
        fetchEvento,
        fetchFunciones,
        fetchTarifas
    };
}