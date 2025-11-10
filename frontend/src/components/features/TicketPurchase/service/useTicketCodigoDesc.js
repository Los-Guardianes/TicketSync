import { useState } from "react";
import { getDescuentoByCodigo } from "../../../../globalServices/DescuentoService"; 
import {useNotification} from "../../../../context/NotificationContext"
export const useTicketCodigoDesc = () => {
    
    const { 
        showNotification 
    } = useNotification()
    const [descuentoCodigo, setDescuentoCodigo] = useState(null)
    const [formData, setFormData] = useState({
            discount: ''            
    })

    const handleFormData = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    

const handleDeleteDiscount = () => {        
        setFormData(prev => ({
            ...prev,
            discount: ''
        }));        
        setDescuentoCodigo(null);
    }

    const handleAplicarCodigo = async (e, discount) => {
        //por cambiar el setNotification    
        e.preventDefault();
        const codigo = discount       
        if (!codigo) {
            showNotification(
                "Por favor, ingresa un código de descuento.",
                "warning"
            )
            return;
        }
        try {
            const descuento =  await verificarDescuentoCodigo(codigo);            
            if (!descuento) {                            
                showNotification(
                    "Código de descuento inválido.",
                    "error"
                );
            }else{
                showNotification(
                    "Código de descuento válido.",
                    "success"
                )
            }
        } catch (error) {            
            showNotification(
                "Error al verificar el código de descuento.",
                "error"
            );
        }
    };

    const verificarDescuentoCodigo = async(codigo) => {
        const descuento = await getDescuentoByCodigo(codigo);        
        if(!descuento && descuento.idEvento != idevento)return null; //cambiar si es que después es un DTO        
        setDescuentoCodigo(descuento);
        return descuento;
    }
    

    return ({
        formData,
        descuentoCodigo,
        handleFormData,
        handleAplicarCodigo,
        handleDeleteDiscount
    })
}