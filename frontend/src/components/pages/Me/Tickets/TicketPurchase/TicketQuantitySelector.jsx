export const ShoppingDetails = ({ totalDetalle, listaDetalles }) => {
    return (
        <>
            {totalDetalle === 0 ? (
                <div className="text-center py-10 px-5 opacity-40">
                    <img src="/tuticket_logo_name.png" alt="Carrito vacío" className="max-w-[250px] mx-auto" />
                    <p className="text-[#2EA062] text-[20px] font-bold">Agregue entradas</p>
                </div>
            ) : (
                <div className="max-h-[400px] overflow-y-auto">
                    {listaDetalles.map((detalle, index) => (
                        <div key={index} className="entrada-card border-b border-gray-200 p-3 flex justify-between">
                            <div className="entrada-header">
                                <h3 className="font-semibold">{detalle.zona.nombre}</h3>
                                <span>{detalle.temporada.nombre}</span>
                            </div>
                            <div className="entrada-details">
                                <div className="detail-row flex justify-between">
                                    <span>Cantidad:</span>
                                    <strong>{detalle.GetCantidad()}</strong>
                                </div>
                                <div className="detail-row flex justify-between">
                                    <span>Precio:</span>
                                    <span>S/ {detalle.GetPrecioDetalle()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
