"use client"

import "./ShoppingDetails.css"

export const ShoppingDetails = ({totalDetalle, listaDetalles}) => {
    return (
        <>
            {totalDetalle === 0 ? (
                <div className="empty-state">
                    <img className="empty-state-image" src="/tuticket_logo_name.png" alt="Carrito vacío" />
                    <p>Agregue entradas</p>
                </div>
            ):(
            <div className="shopping-list">                    
                {listaDetalles.map((detalle,index) => (
                    <div key={index} className={`entrada-card`}>
                        <div className="entrada-header">
                            <h3>{detalle.tarifa.zona.nombre}</h3>
                            <span>
                                {detalle.tarifa.tipoEntrada.nombre}
                            </span>
                        </div>                        
                        <div className="entrada-details">
                            <div className="detail-row">
                                <span>Cantidad:</span>
                                <strong>{detalle.cantidad}</strong>
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