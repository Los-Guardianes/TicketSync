import { use, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTicketPurchase } from "../service/useTicketPurchase"
import { DetalleCompra } from "../models/DetalleCompra"
import { DropdownOptions } from "../components/DropdownOptions"
import { TicketQuantitySelector } from '../components/TicketQuantitySelector'
import { ShoppingDetails } from '../components/ShoppingDetails'
import { InfoEventTicket } from '../components/InfoEventTicket'

import "./TicketPurchase.css"

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
    const [selectedFuncion, setSelectedFuncion] = useState(null);
    const [selectedTipoEntrada, setSelectedTipoEntrada] = useState(null);

    const navigate = useNavigate();
    const {
        formData,
        errors,
        isLoading,
        message,
        zonas,
        periodo,
        evento,
        funciones,
        tipoEntradas,
        tarifas,
        handleInputChange,
        fetchPeriodo,
        fetchEvento,
        fetchFunciones,
        fetchTarifas
    } = useTicketPurchase(id);
 
    useEffect(() => {
        fetchEvento();
        //fetchPeriodo();
        fetchFunciones();
        fetchTarifas();
    }, [id]);
    
    const incrementar = () => {
        if (cantidadEntradas < maximoEntradas)setCantidadEntradas(prev => prev + 1);
    };

    const decrementar = () => {
        setCantidadEntradas(prev => Math.max(1, prev - 1));
    };

    const handleDiscount = async (e) => {
        e.preventDefault();
        //falta implementar validacion de codigo de descuento
    };

    const handleContinueToPay = () => {
        //falta verificar que la listaDetalles no este vacia
        if (listaDetalles.length === 0) {
            alert("Agrega al menos un detalle de compra antes de continuar.");
            return;
        }
        navigate("/ticket-pay", { state: {
            listaDetalles: listaDetalles.map(detalle => ({
                        cantidad: detalle.cantidad,
                        idZona: detalle.zona.idZona,
                        idTemporada: detalle.temporada.idTemporada,
            })),    
            montoFinal: montoFinal,
            funcion: selectedFuncion,
        }});
    }

    const agregarIncrementarDetalle = () => {
        const precioCalculadoLocal = selectedZona.tipoEntrada.precioBase * (1 - selectedTemporada.porcentajeDesc / 100);
        const precioDetalleLocal = precioCalculadoLocal * cantidadEntradas;

        const listaActual = listaDetalles;

        const indexExistente = listaActual.findIndex(detalle => 
            detalle.zona.idZona === selectedZona.idZona && 
            detalle.temporada.idTemporada === selectedTemporada.idTemporada
        );
        if (indexExistente >= 0) {
            const nuevaLista = [...listaActual];
            detalleExistente.precioDetalle += precioDetalleLocal;
            detalleExistente.cantidad += cantidadEntradas;
            const detalleExistente = nuevaLista[indexExistente];

            setListaDetalles(nuevaLista);
        } else {
            const nuevoDetalle = new DetalleCompra(
                selectedZona, 
                selectedTemporada, 
                precioDetalleLocal, 
                cantidadEntradas
            );            
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
                <section id="purchase_selection">
                    <div className="data_purchase">
                        <div>
                            <h2>Zona</h2>                        
                            <DropdownOptions                        
                                options={zonas}
                                setSelectedOption={setSelectedZona}
                                selectedOption={selectedZona}    
                                price={selectedZona?.tipoEntrada?.precioBase}
                            />    
                        </div>                        
                        <div>
                            <h2>Tipo Entrada</h2>
                            <DropdownOptions                        
                                options={tipoEntradas}
                                setSelectedOption={setSelectedTipoEntrada}
                                selectedOption={selectedTipoEntrada}
                            />
                        </div>
                        <div>
                            <h2>Funciones</h2>
                            <DropdownOptions                        
                                options={funciones}
                                setSelectedOption={setSelectedFuncion}
                                selectedOption={selectedFuncion}
                                nombre='horaInicio'
                            />
                        </div>                         
                    </div>                
                    <div className="data_purchase">
                        <div>                    
                            <h2>Canjear código</h2>
                            <form className="form-discount" onSubmit={handleDiscount}>
                                <input 
                                    className={`input-form ${errors.discount ? 'error' : ''}`}
                                    name='discount'
                                    placeholder='Ingresa el código de descuento'
                                    maxLength={100}
                                    value={formData.discount}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
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
                        {selectedZona ? (
                            <TicketQuantitySelector
                                cantidadEntradas={cantidadEntradas}
                                incrementar={incrementar}
                                decrementar={decrementar}
                            >
                                <h2>Cantidad de entradas</h2>
                            </TicketQuantitySelector>                        
                        ) : null}
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
                    <ShoppingDetails 
                        totalDetalle={totalDetalle}
                        listaDetalles={listaDetalles}
                    />
                </section>
            </div>
            <section id="info-event-ticket">
                <InfoEventTicket 
                    evento={evento}
                    totalDetalle={totalDetalle}
                    montoDescuento={montoDescuento}
                    montoComision={montoComision}
                    montoFinal={montoFinal}
                />
                <button 
                className='btn btn-primary'
                onClick={handleContinueToPay}
                >
                    Continuar
                </button>
            </section>
        </main>
    )
}