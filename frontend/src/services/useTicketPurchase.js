import { useState } from 'react';

export const useTicketPurchase = () => {
    const [formData, setFormData] = useState({discount: ''});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [zonas, setZonas] = useState([]);
    const [temporadas, setTemporadas] = useState([]);

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

    const fetchZonas = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/zona/evento/1");
            if (!response.ok) {
                throw new Error("Error al obtener las zonas");
            }
            const dataZona = await response.json();
            setZonas(dataZona);
            console.log(dataZona.nombre);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchTemporadas = async () => {
        try{
            const response = await fetch();
            if (!response.ok) {
                throw new Error("Error al obtener las temporadas");
            }
            const dataTemporada = await response.json();
            setTemporadas(dataTemporada);
        } catch (error) {
            console.error("Error", error); // Reemplazar por metodo de mensaje
        }
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