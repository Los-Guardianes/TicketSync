
export const ShoppingDetails = ({totalDetalle, listaDetalles}) => {
    return (
        <>
            {totalDetalle === 0 ? (
                <div className="empty-state">
                    <img src="/tuticket_logo_name.png" alt="Carrito vacío" />
                    <p>Agregue entradas</p>
                </div>
            ):(
            <div className="shopping-list">                    
                {listaDetalles.map((detalle,index) => (
                    <div key={index} className={`entrada-card`}>
                        <div className="entrada-header">
                            <h3>{detalle.zona.nombre}</h3>
                            <span>
                                {detalle.temporada.nombre}
                            </span>
                        </div>                        
                        <div className="entrada-details">
                            <div className="detail-row">
                                <span>Cantidad:</span>
                                <strong>{detalle.GetCantidad()}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Precio:</span>
                                <span>${detalle.GetPrecioDetalle()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </>
    );
}