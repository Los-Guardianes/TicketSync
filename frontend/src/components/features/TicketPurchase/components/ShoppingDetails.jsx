import { TicketQuantitySelector } from "./TicketQuantitySelector"

import "./ShoppingDetails.css"

export const ShoppingDetails = ({listaDetalles, updateCantidad, removeDetalle, maxCantidad}) => {
    return (
        <>
            {listaDetalles.length === 0 ? (
                <div className="empty-state">
                    <img className="empty-state-image" src="/tuticket_logo_name.png" alt="Carrito vacío" />
                    <p>Agregue entradas</p>
                </div>
            ):(
            <div className="shopping-list">                    
                {listaDetalles.map((detalle) => (
                    <div key={detalle.tarifa.idTarifa} className={`entrada-card`}>
                        <div className="entrada-header">
                            <h3>{detalle.tarifa.zona.nombre}</h3>
                            <span>
                                {detalle.tarifa.tipoEntrada.nombre}
                            </span>
                        </div>                        
                        <div className="entrada-details">
                            <div className="detail-row">
                                <span>Cantidad:</span>
                                <TicketQuantitySelector
                                    cantidadEntradas={detalle.cantidad}
                                    updateCantidad={updateCantidad}
                                    idTarifa={detalle.tarifa.idTarifa}
                                    maxCantidad={maxCantidad}                               
                                />                                
                            </div>
                            <div className="detail-row">
                                <span>Precio:</span>
                                <span>${detalle.precioDetalle}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </>
    );
}