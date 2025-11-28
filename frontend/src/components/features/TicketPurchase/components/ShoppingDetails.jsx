import { TicketQuantitySelector } from "./TicketQuantitySelector"

// Importamos el CSS que nos pasaste
import "./ShoppingDetails.css"

export const ShoppingDetails = ({listaDetalles, updateCantidad, getMaxCantidadTickets, selectedFuncion}) => {
    

    if (!selectedFuncion) {
        return (
            <div className="empty-state">
                <p>Selecciona una función para ver las entradas disponibles.</p>
            </div>
        );
    }

    // Si hay una función seleccionada, mapeamos las entradas
    return (
        <div className="shopping-list">               
            {listaDetalles.map((detalle) => {
                
                // 1. Calculamos la cantidad máxima para esta tarjeta específica
                const maxCantidad = getMaxCantidadTickets(detalle.tarifa.zona);
                
                // 2. Verificamos si está agotado (disponibilidad 0 O límite de compra 0)
                const isAgotado = maxCantidad <= 0;

                return (
                    // 3. Aplicamos una clase 'agotado' a la tarjeta para atenuarla
                    <div key={detalle.tarifa.idTarifa} className={`entrada-card ${isAgotado ? 'agotado' : ''}`}>
                        <div className="entrada-header">
                            <h3>{detalle.tarifa.zona.nombre}</h3>
                            <span>
                                {detalle.tarifa.tipoEntrada.nombre}
                            </span>
                        </div>                            
                        <div className="entrada-details">
                            
                            {/* 4. Renderizado Condicional */}
                            {isAgotado ? (
                                <div className="detail-row agotado-mensaje">
                                    {/* Mostramos "Agotado" en rojo */}
                                    <strong>Agotado</strong>
                                </div>
                            ) : (
                                <>
                                    <div className="detail-row">
                                        <span>Cantidad:</span>
                                        <TicketQuantitySelector
                                            cantidadEntradas={detalle.cantidad}
                                            updateCantidad={updateCantidad}
                                            idTarifa={detalle.tarifa.idTarifa}
                                            maxCantidad={maxCantidad} // Le pasamos el max real                                 
                                        />                                        
                                    </div>
                                    <div className="detail-row">
                                        <span>Precio:</span>
                                        {/* Usamos <strong> como en tu CSS */}
                                        <strong>${detalle.precioDetalle}</strong>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>          
    );
}