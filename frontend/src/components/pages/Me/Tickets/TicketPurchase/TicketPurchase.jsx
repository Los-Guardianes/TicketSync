import { use, useEffect, useState } from 'react'
import { Header } from '../../../../common/Header/Header'
import { useParams } from 'react-router-dom'
import "./TicketPurchase.css"
import { useTicketPurchase } from '../../../../../services/useTicketPurchase'

export const TicketPurchase = () => {

    
    const {id} = useParams();
    const [cantidadEntradas, setCantidadEntradas] = useState(1);
    const [maximoEntradas, setMaximoEntradas] = useState(1);
    const [precio, setPrecio] = useState(0.0);
    const [comision, setComision] = useState(0);
    const [discount, setDiscount] = useState(0.0);
    const [total, setTotal] = useState(0.0);

    const [selectedZona, setSelectedZona] = useState("Seleccionar");
    const [selectedTemporada, setSelectedTemporada] = useState("Seleccionar");

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
        fetchEvento
    } = useTicketPurchase(id);

 
    useEffect(() => {
        fetchEvento();
        fetchZonas();
        fetchTemporadas();
    }, [id]);
    

    const incrementar = () => {
        setCantidadEntradas(prev => prev + 1);
    };

    const decrementar = () => {
        setCantidadEntradas(prev => Math.max(1, prev - 1)); // No permite menos de 1
    };

    const handleDiscount = async (e) => {
            e.preventDefault();
            
            /*
            if (!validateForm()) {
                return;
            }
    
            setIsLoading(true);
            clearMessage();
    
            try {
                const result = await loginService.login(formData.email, formData.password);
                
                if (result.success) {
                    showMessage(result.message, 'success');
                    
                    // Redirigir a la página principal después de 2 segundos
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    showMessage(result.message, 'error');
                }
            // eslint-disable-next-line no-unused-vars
            } catch (e) {
                showMessage('Error al iniciar sesión. Por favor, intenta nuevamente.', 'error');
            } finally {
                setIsLoading(false);
            }
                */
    };

    const addTicketToList = () => {

    }
    // Lista de sectores por evento

    // Lista de temporada por evento

    // Lista de entradas por sector

    // Maximo de entradas general

    // Maximo de entradas por entrada

    // Verificar código

    // Funcion para obtener la comisión
    
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
                                    {selectedZona}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    {zonas.map((zona) => (
                                        <li key={zona.id}>
                                            <a 
                                                className="dropdown-item" 
                                                href="#"
                                                onClick={() => setSelectedZona(zona.nombre)}
                                            >
                                                {zona.nombre}
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
                                        {selectedTemporada}
                                </button>
                                 <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    {temporadas.map((temporada) => (
                                        <li key={temporada.id}>
                                            <a 
                                                className="dropdown-item" 
                                                href="#"
                                                onClick={() => setSelectedTemporada(temporada.nombre)}
                                            >
                                                {temporada.nombre}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
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
                    </div>
                </section>

                <section id="purchase_actions">
                    <button className='btn btn-secondary'>Regresar</button>
                    <button 
                        className='btn btn-primary'
                        onClick={addTicketToList}
                    >
                        Agregar
                    </button>
                </section>
                <section id="list_purchase">
                    {total === 0 ? (
                        <div className="empty-state">
                            <img src="/tuticket_logo_name.png" alt="Carrito vacío" />
                            <p>Agregue entradas</p>
                        </div>
                    ):(
                    <div className="shopping-list">
                        {/* Aquí va tu lista dinámica de compras */}
                        {/*
                        {detalleCompras.map(producto => (
                            <div key={producto.id} className="product-item">
                                {producto.nombre} - ${producto.precio}
                            </div>
                        ))}
                            */}
                    </div>
                    )}
                </section>
            </div>

            <div id="info-event-ticket">
                <h2>{evento?.nombre || 'Cargando...'}</h2>
                <img src="/tuticket_logo.png"/>
                <ul>
                    <li>
                        <h3>Precio:</h3>
                        <p>S/ {precio}</p>
                        
                    </li>
                    <li>
                        <h3>Comisión:</h3>
                        <p>S/ {comision}</p>                        
                    </li>
                    <li>
                        <h3>Descuento:</h3>
                        <p>S/ {discount}</p>
                        
                    </li>
                    <li>
                        <h3>TOTAL</h3>
                        <p>S/ {total}</p>                        
                    </li>
                </ul>
                
            </div>
        </main>
    )
}