import { TicketQuantitySelector } from "./TicketQuantitySelector"

import "./ShoppingDetails.css"

export const ShoppingDetails = ({listaDetalles, updateCantidad, getMaxCantidadTickets, disabled}) => {
    return (
        <>
        {disabled && (
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
                                    maxCantidad={getMaxCantidadTickets(detalle.tarifa.zona)}                           
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