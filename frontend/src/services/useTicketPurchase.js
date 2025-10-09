import { useState } from 'react';
import { getEventosById } from "../services/EventoService";
export const useTicketPurchase = (idevento) => {

    const [formData, setFormData] = useState({discount: ''});
    const [errors, setErrors] = useState({});
    const [zonas, setZonas] = useState([]);
    const [temporadas, setTemporadas] = useState([]);
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
        try {
            const response = await fetch(`http://localhost:8080/api/zona/evento/${idevento}`);
            if (!response.ok) {
                throw new Error("Error al obtener las zonas");
            }
            const dataZona = await response.json();
            setZonas(dataZona);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchTemporadas = async () => {
        try{
            const response = await fetch(`http://localhost:8080/api/temporada/evento/${idevento}`);
            if (!response.ok) {
                throw new Error("Error al obtener las temporadas");
            }
            const dataTemporada = await response.json();
            setTemporadas(dataTemporada);
        } catch (error) {
            console.error("Error", error);
        }
    };

    return {
        formData,
        errors,
        zonas,
        temporadas,
        evento,
        handleInputChange,
        fetchZonas,
        fetchTemporadas,
        fetchEvento,
    };
}