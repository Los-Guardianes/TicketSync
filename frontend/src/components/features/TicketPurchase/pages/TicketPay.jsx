import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { OrdenCompra } from "../models/ordenCompra";
import "./TicketPay.css"
import { useAuth } from "../../../../context/AuthContext";
import { postOrdenCompra } from "../service/ticketPayService";

export const TicketPay = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { listaDetalles = [], montoFinal = 0, funcion } = location.state || {};
    const {user} = useAuth();

    const handleReturn = (e) => {
        e.preventDefault();
        navigate(-1); // vuelve a la página anterior
    };
    
    const [formData, setFormData] = useState({
        CardNumber: "",
        CVV: "",
        metodoPago: "",
        fechaVencimiento: "",
    });

    const validateForm = () => {        
        if(!formData.metodoPago.trim()){
            alert("El método de pago es obligatorio.");
            return;
        }
        return true
    }

    const handlePay = async (e) => {
        e.preventDefault();
        console.log("Formulario de pago enviado");
        if (!validateForm()) return;
        const detallesCompras = listaDetalles.map(detalle => ({
                cantidad: detalle.cantidad,
                precioDetalle: detalle.precioDetalle,
                idTarifa: detalle.tarifa?.idTarifa,
                idPeriodo: detalle.idPeriodo
        }))
        const ordenCompra = new OrdenCompra(
            formData.metodoPago,
            user.idUsuario,
            funcion.idFuncion,
            detallesCompras
        );
        console.log("Enviando orden de compra:", ordenCompra);
        try {
            const ordenDevuelta = await postOrdenCompra(ordenCompra);
            console.log("Orden de compra realizada:", ordenDevuelta);
            navigate("/happy-pay", {
                state: {
                    idOrden : ordenDevuelta.idOrdenCompra
                }
            });
        } catch (error) {
            console.error("Error al realizar la orden de compra:", error);
            alert("Error al procesar el pago. Por favor, inténtelo de nuevo.");
        }
    };



    const handleInputChange = (onChangeEvent) => {
        const { name, value } = onChangeEvent.target;
        let newValue = value;
        if(name === "metodoPago"){
            newValue = value.replace(/[0-9]/g, '');
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue
        }));
    };

    return (
        <div className="tp-container">
            <h1>Pasarela de pagos</h1>

            <section>
                <h3>Total general: S/ {montoFinal}</h3>
            </section>

            <form className="tp-form" onSubmit={handlePay}>
                <h2>Datos de pago</h2>

                <div className="tp-form-row">
                    <label htmlFor="CardNumber">Número de tarjeta</label>
                    <input id="CardNumber" name="CardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.CardNumber}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="tp-form-row">
                    <div className="tp-field">
                        <label htmlFor="CVV">CVV</label>
                        <input id="CVV" name="CVV"
                            value={formData.CVV}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="tp-form-row">
                        <label htmlFor="metodoPago">Método de pago</label>
                        <input 
                            id="metodoPago" 
                            name="metodoPago"
                            value={formData.metodoPago}
                            onChange={handleInputChange}
                            placeholder="Visa, Mastercard, etc."                            
                        />                        
                    </div>
                </div>

                <div className="tp-form-row">
                    <label htmlFor="fechaVencimiento">Fecha de vencimiento</label>
                    <input 
                        id="fechaVencimiento" 
                        name="fechaVencimiento" 
                        type="date"
                        onChange={handleInputChange}
                        value={formData.fechaVencimiento}
                    />
                </div>

                <div className="tp-buttons">
                    <button className="btn btn-secondary" onClick={handleReturn}>Regresar</button>
                    <button className="btn btn-primary" type="submit">Pagar</button>                
                </div>
            </form>
        </div>
    );
};
