/* eslint-disable */
import { use, useEffect, useState } from 'react'
import { Header } from '../../../../common/Header/Header'
import { useParams } from 'react-router-dom'
import "./TicketPurchase.css"
import { useTicketPurchase } from '../../../../../services/useTicketPurchase'
import { Zona } from '../../../../../models/Zona'
import { Temporada } from '../../../../../models/Temporada'
import { TipoEntrada } from '../../../../../models/TipoEntrada'
import { DetalleCompra } from '../../../../../models/DetalleCompra'

export const TicketPurchase = () => {

    const {id} = useParams();
    const [cantidadEntradas, setCantidadEntradas] = useState(1);
    const [maximoEntradas, setMaximoEntradas] = useState(5);
    const [precioCalculado, setPrecioCalculado] = useState(0.0);
    const [precioDetalle, setPrecioDetalle] = useState(0.0);
    const [discount, setDiscount] = useState(0.0);
    const [montoDescuento, setMontoDescuento] = useState(0.0);
    const [comision, setComision] = useState(10);
    const [montoComision, setMontoComision] = useState(0.0);
    const [totalDetalle, setTotalDetalle] = useState(0.0);
    const [montoFinal, setMontoFinal] = useState(0.0);
    const [listaDetalles, setListaDetalles] = useState([]);

    const [selectedZona, setSelectedZona] = useState(null);
    const [selectedTemporada, setSelectedTemporada] = useState(null);

    const {
        formData,
        errors,
        isLoading,
        message,
        zonas,
        temporadas,
        evento,
        handleInputChange,
        fetchZonas,
        fetchTemporadas,
        fetchEvento,
    } = useTicketPurchase(id);

 
    useEffect(() => {

        fetchEvento();
        fetchZonas();
        fetchTemporadas();
    }, [id]);
    
    const incrementar = () => {
        if (cantidadEntradas < maximoEntradas)setCantidadEntradas(prev => prev + 1);
    };

    const decrementar = () => {
        setCantidadEntradas(prev => Math.max(1, prev - 1)); // No permite menos de 1
    };

    const handleDiscount = async (e) => {
        e.preventDefault();
    };
    
    const searchTipoEntrada = () => {
        
    }

    const agregarIncrementarDetalle = () => {
        const precioCalculadoLocal = selectedZona.tipoEntrada.precioBase * (1 - selectedTemporada.porcentajeDesc / 100);
        const precioDetalleLocal = precioCalculadoLocal * cantidadEntradas;

        const listaActual = listaDetalles;

        const indexExistente = listaActual.findIndex(detalle => 
            detalle.zona.idZona === selectedZona.idZona && 
            detalle.temporada.idTemporada === selectedTemporada.idTemporada
        );

        console.log(indexExistente);

        if (indexExistente >= 0) {
            // Incrementar cantidad del existente
            const nuevaLista = [...listaActual];
            const detalleExistente = nuevaLista[indexExistente];
            detalleExistente.precioDetalle += precioDetalleLocal;
            detalleExistente.cantidad += cantidadEntradas;
            console.log(nuevaLista);
            setListaDetalles(nuevaLista);
        } else {
            // Crear nuevo detalle
            const nuevoDetalle = new DetalleCompra(
                selectedZona, 
                selectedTemporada, 
                precioDetalleLocal, 
                cantidadEntradas
            );
            console.log([...listaActual, nuevoDetalle]);
            setListaDetalles([...listaActual, nuevoDetalle]);
        }

        setTotalDetalle(totalDetalle+precioDetalleLocal);

        setMontoComision((comision/100)*(totalDetalle+precioDetalleLocal));
        setMontoFinal((1+comision/100)*(totalDetalle+precioDetalleLocal));

        setPrecioCalculado(precioCalculadoLocal);
        setPrecioDetalle(precioDetalleLocal);

        setSelectedZona(null);
        setSelectedTemporada(null);
        setCantidadEntradas(1);
    };
    
    return (
        <main className="buy-ticket">
            <div id="buy-ticket-data">
                <h1>Comprar ticket</h1>
                <section id="data_purchase">
                    <div>                        
                        <h2>Zona</h2>
                        <div className="col">
                            <div className="dropdown">
                                <button 
                                    className="btn btn-light dropdown-toggle"
                                    style={{ background: "#EBF5EB" }}
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {selectedZona ? selectedZona.nombre : "Seleccionar"}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    {zonas.map((zona) => (
                                        <li key={zona.id}>
                                            <a 
                                                className="dropdown-item" 
                                                href="#"
                                                onClick={() => setSelectedZona(zona)}
                                            >
                                                {zona.nombre} (${zona.tipoEntrada.precioBase})
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <h2>Canjear código</h2>
                        <form onSubmit={handleDiscount}>
                            <input 
                                className={`input-form ${errors.discount ? 'error' : ''}`}
                                name='discount'
                                placeholder='Ingresa el código de descuento'
                                maxLength={100}
                                value={formData.discount}
                                onChange={handleInputChange}
                                disabled={isLoading}/>

                            <button 
                                type="submit" 
                                className='btn btn-secondary btn-lg mt-3'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verificando...' : 'Aplicar'}
                            </button>
                        </form>
                        {errors.discount && <div className="error-form">{errors.discount}</div>}
                    </div>
                
                    <div>
                        <h2>Temporada</h2>
                        {/*Dropdown de Zona */}
                        <div className="col">
                            <div className="dropdown">
                            
                                <button className="btn btn-light dropdown-toggle " style={{ background: "#EBF5EB" }}
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                        {selectedTemporada ? selectedTemporada.nombre : "Seleccionar"}
                                </button>
                                 <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    {temporadas.map((temporada) => (
                                        <li key={temporada.id}>
                                            <a 
                                                className="dropdown-item" 
                                                href="#"
                                                onClick={() => setSelectedTemporada(temporada)}
                                            >
                                                {temporada.nombre}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {selectedZona != "Seleccionar" ? (
                            <>
                            <h2>Cantidad de entradas</h2>
                            <div>
                                <button 
                                    className='btn rounded-full' 
                                    style={{ background: "#EBF5EB", fontWeight: "700"}}
                                    onClick={decrementar}>-</button>
                                {cantidadEntradas}
                                <button 
                                    className='btn rounded-full' 
                                    style={{ background: "#EBF5EB", fontWeight: "700" }}
                                    onClick={incrementar}>+</button>
                            </div>
                        </>
                        ):(<></>)}
                    </div>
                </section>

                <section id="purchase_actions">
                    <button className='btn btn-secondary'>Regresar</button>
                    <button 
                        className='btn btn-primary'
                        onClick={agregarIncrementarDetalle}
                    >
                        Agregar
                    </button>
                </section>

                <section id="list_purchase">
                    {totalDetalle === 0 ? (
                        <div className="empty-state">
                            <img src="/tuticket_logo_name.png" alt="Carrito vacío" />
                            <p>Agregue entradas</p>
                        </div>
                    ):(
                    <div className="shopping-list">
                        {/* Aquí va tu lista dinámica de compras */}
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
                </section>
            </div>

            <div id="info-event-ticket">
                <h2>{evento?.nombre || 'Cargando...'}</h2>
                <img src="/tuticket_logo.png"/>
                <ul>
                    <li>
                        <h3>Total detalles:</h3>
                        <p>S/ {totalDetalle}</p>
                        
                    </li>
                    <li>
                        <h3>Descuento:</h3>
                        <p>S/ {montoDescuento}</p>
                        
                    </li>
                    <li>
                        <h3>Comisión:</h3>
                        <p>S/ {montoComision}</p>                        
                    </li>
                    <li>
                        <h3>Monto Final</h3>
                        <p>S/ {montoFinal}</p>                        
                    </li>
                </ul>
                <button 
                    className='btn btn-primary'
                    >Pagar</button>
            </div>
        </main>
    )
}