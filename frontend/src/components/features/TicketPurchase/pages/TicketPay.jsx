import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { OrdenCompra } from "../models/ordenCompra";
import "./TicketPay.css"
import { useAuth } from "../../../../context/AuthContext";
import { postOrdenCompra } from "../service/ticketPayService";
import { Notification } from "../../../../components/common/Notification/Notification"


export const TicketPay = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { listaDetalles = [], montoFinal = 0, funcion } = location.state || {};
    const {user} = useAuth();

    const [notification, setNotification] = useState(null)

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
        if (!formData.metodoPago.trim()) {
            setNotification({
                message: "El método de pago es obligatorio.", 
                type: "error"
            });
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
            setNotification({
                message: "Error al procesar el pago. Por favor, inténtelo de nuevo.",
                type: "error"
            });
        }
    };

    const formatCardNumber = (value) => {
        return value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
    }

    const formatExpiryDate = (value) => {
        const cleaned = value.replace(/\D/g, "")
        if (cleaned.length >= 2) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
        }
        return cleaned
    }

    const handleInputChange = (onChangeEvent) => {
        const { name, value } = onChangeEvent.target;
        let newValue = value;
        if(name === "metodoPago"){
            newValue = value.replace(/[0-9]/g, '');
        }
        if (name === "CardNumber") {
            newValue = formatCardNumber(value);
        }
        if (name === "fechaVencimiento") {
            newValue = formatExpiryDate(value);
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue
        }));
    };

    return (
        <div className="tp-container">

            {notification && (
                <Notification
                message={notification.message}
                type={notification.type}
                duration={3000}
                onClose={() => setNotification(null)}
                />
            )}

            <header className="tp-header">
                <h1>Pasarela de Pagos</h1>
            </header>

            <section className="tp-summary">
                <h2>Resumen de Compra</h2>
                <div className="tp-total">
                    <span>Total a pagar:</span>
                    <strong>S/ {montoFinal?.toFixed(2) || "0.00"}</strong>
                </div>
            </section>

            <form className="tp-form" onSubmit={handlePay}>
                <legend>Datos de pago</legend>

                <div className="tp-form-group">
                    <label htmlFor="CardNumber">Número de Tarjeta</label>
                    <input id="CardNumber" name="CardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.CardNumber}
                        maxLength={23}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="tp-form-row">
                    <div className="tp-form-group">
                        <label htmlFor="CVV">CVV</label>
                        <input id="CVV" name="CVV"
                            value={formData.CVV}
                            placeholder="123"
                            maxLength={4}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="tp-form-group">
                        <label htmlFor="fechaVencimiento">Vencimiento</label>
                        <input 
                            id="fechaVencimiento" 
                            name="fechaVencimiento" 
                            type="text"
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            value={formData.fechaVencimiento}
                        />
                    </div>

                </div>

                <div className="tp-form-group">
                    <label htmlFor="metodoPago">Método de pago</label>
                    <input 
                        id="metodoPago" 
                        name="metodoPago"
                        value={formData.metodoPago}
                        onChange={handleInputChange}
                        placeholder="Visa, Mastercard, etc."                            
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
