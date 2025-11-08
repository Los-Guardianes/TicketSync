import { useState } from "react";
import { getDescuentoByCodigo } from "../../../../globalServices/DescuentoService"; 
export const useTicketCodigoDesc = () => {
    
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

    const handleAplicarCodigo = async (e, discount, setNotification) => {
        //por cambiar el setNotification    
        e.preventDefault();
        const codigo = discount       
        if (!codigo) {
            setNotification({
                message: "Por favor, ingresa un código de descuento.",
                type: "warning",
            });
            return;
        }
        try {
            const descuento =  await verificarDescuentoCodigo(codigo);            
            if (!descuento) {                            
                setNotification({
                    message: "Código de descuento inválido.",
                    type: "error",
                });
            }else{
                setNotification({
                    message: "Código de descuento válido.",
                    type: "success",
                })
            }
        } catch (error) {            
            setNotification({
                message: "Error al verificar el código de descuento.",
                type: "error",
            });
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