import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext'; // Importa el hook de autenticación
import { postEventoCompleto } from './../../../../globalServices/EventoService';
import { postSubirImagen } from "./../../../../globalServices/S3Service";

export const useEvento = (eventData, updateEventData, navigate) => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth(); // Obtener el usuario del contexto

    const handleMonedaChange = (e) => {
        updateEventData({ moneda: e.target.value });
    };

    const handleMaxComprasChange = (e) => {
        updateEventData({ maxComprasTicket: Number(e.target.value) });
    };

    const handleFinalSubmit = async () => {
        console.log("Enviando datos finales al backend:", eventData);
        setIsLoading(true);
        let finalImageUrl = null;
        let finalMapaUrl = null;

        // ✅ Validar que el usuario esté autenticado
        if (!user || !user.idUsuario) {
            alert("Debes iniciar sesión para crear un evento");
            setIsLoading(false);
            return;
        }

        // Validaciones básicas
        if (!eventData.nombre || !eventData.idCategoria || !eventData.idCiudad) {
            alert("Por favor, completa la información básica del evento");
            setIsLoading(false);
            return;
        }

        if (!eventData.zonas || eventData.zonas.length === 0) {
            alert("Debes crear al menos una zona");
            setIsLoading(false);
            return;
        }

        if (!eventData.tiposDeEntrada || eventData.tiposDeEntrada.length === 0) {
            alert("Debes crear al menos un tipo de entrada");
            setIsLoading(false);
            return;
        }

        if (!eventData.tarifas || eventData.tarifas.length === 0) {
            alert("Debes crear al menos una tarifa");
            setIsLoading(false);
            return;
        }

        try {
            // Subir imagen si existe
            if (eventData.imagenFile) {
                try {
                    const formData = new FormData();
                    formData.append('file', eventData.imagenFile);
                    const s3Response = await postSubirImagen(formData);
                    finalImageUrl = s3Response.url;
                    console.log('Imagen subida exitosamente:', finalImageUrl);
                } catch (error) {
                    console.error('Error al subir imagen:', error);
                    alert('Error al subir la imagen, pero continuando con el proceso...');
                    finalImageUrl = "https://via.placeholder.com/836x522.png?text=Imagen+Evento";
                }
            } else {
                finalImageUrl = "https://via.placeholder.com/836x522.png?text=Imagen+Evento";
            }

            // Subir mapa si existe
            if (eventData.mapaFile) {
                try {
                    const formData = new FormData();
                    formData.append('file', eventData.mapaFile);
                    const s3Response = await postSubirImagen(formData);
                    finalMapaUrl = s3Response.url;
                    console.log('Mapa subido exitosamente:', finalMapaUrl);
                } catch (error) {
                    console.error('Error al subir mapa:', error);
                    alert('Error al subir el mapa, pero continuando con el proceso...');
                    finalMapaUrl = "https://via.placeholder.com/836x522.png?text=Mapa+Referencia";
                }
            } else {
                finalMapaUrl = "https://via.placeholder.com/836x522.png?text=Mapa+Referencia";
            }

            const payload = {
                nombre: eventData.nombre,
                descripcion: eventData.descripcion,
                informAdic: eventData.informAdic,
                restricciones: eventData.restricciones,
                direccion: eventData.direccion,
                moneda: eventData.moneda || "SOL",
                maxComprasTicket: eventData.maxComprasTicket || 4,
                idCiudad: eventData.idCiudad,
                idCategoria: eventData.idCategoria,
                idUsuario: user.idUsuario, // ✅ Usar el ID del usuario logueado
                urlImagen: finalImageUrl,
                urlMapa: finalMapaUrl,
                funciones: (eventData.funciones || []).map(f => ({
                    ...f,
                    horaInicio: f.horaInicio ? `${f.horaInicio}:00` : "00:00:00",
                    horaFin: f.horaFin ? `${f.horaFin}:00` : "00:00:00",
                })),
                temporadas: eventData.temporadas || [],
                zonas: eventData.zonas || [],
                tiposDeEntrada: eventData.tiposDeEntrada || [],
                tarifas: eventData.tarifas || []
            };

            console.log("Payload final:", JSON.stringify(payload, null, 2));
            console.log("Usuario creador:", user); // Para debug

            // Enviar evento completo al backend
            const eventoCreado = await postEventoCompleto(payload);
            alert('¡Evento creado con éxito!');
            console.log('Respuesta del servidor:', eventoCreado);
            navigate('/home');

        } catch (error) {
            console.error("Error en el proceso de guardado:", error);
            alert(`Hubo un problema al crear el evento: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        handleMonedaChange,
        handleMaxComprasChange,
        handleFinalSubmit
    };
};