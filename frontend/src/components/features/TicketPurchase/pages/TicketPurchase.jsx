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
    const [selectedPeriodo, setSelectedPeriodo] = useState(null);
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
        fetchZonas,
        fetchTipoEntradas,
        fetchPeriodo,
        fetchEvento,
        fetchFunciones,
        fetchTarifas
    } = useTicketPurchase(id);
 
    useEffect(() => {
        fetchEvento();
        fetchPeriodo();
        fetchFunciones();
        fetchTarifas();
        fetchZonas();
        fetchTipoEntradas();    
    }, [id]);
    

    const getPeriodoActual = (listaPeriodos) => {
        if (!listaPeriodos || listaPeriodos.length === 0) return null;

        const hoy = new Date(); // fecha actual
        return listaPeriodos.find((p) => {
            const inicio = new Date(p.fechaInicio);
            const fin = new Date(p.fechaFin);
            return hoy >= inicio && hoy <= fin;
        }) || null; // si no encuentra ninguno, devuelve null
    }

    useEffect(() => {
        if (periodo && periodo.length > 0) {
            const actual = getPeriodoActual(periodo);
            setSelectedPeriodo(actual);
        }
        console.log("Periodo actualizado:", selectedPeriodo);
    }, [periodo]);


    const incrementar = () => {
        if (cantidadEntradas < maximoEntradas)setCantidadEntradas(prev => prev + 1);
    };

    const handleRegresar = () => {
        navigate(-1);
    }

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
            listaDetalles: listaDetalles,
            montoFinal: totalDetalle, //falta aplicar descuento y comision
            funcion: selectedFuncion,
        }});
    }

    const agregarIncrementarDetalle = () => {
        if (!selectedZona || !selectedTipoEntrada || !selectedFuncion) {
            alert("Selecciona una zona, un tipo de entrada y una función antes de agregar.");
            return;
        }
        const selectedTarifa = tarifas.find(
            t => 
            t.tipoEntrada.idTipoEntrada === selectedTipoEntrada.idTipoEntrada &&
            t.zona.idZona === selectedZona.idZona
        );
        if (!selectedTarifa) {
            alert("No se encontró una tarifa para la combinación seleccionada de zona y tipo de entrada.");
            return;
        }
        
        const listaActual = [...listaDetalles];
        console.log("Tarifa seleccionada:", selectedTarifa);
        console.log("Lista actual antes de agregar/incrementar:", listaActual);
        const indexExistente = listaActual.findIndex(
            detalle => 
            detalle.tarifa.idTarifa === selectedTarifa.idTarifa
        );
        const precioDetalleAgregado = selectedTarifa.precioBase * cantidadEntradas;

        if (indexExistente >= 0) {
            const detalleExistente = listaActual[indexExistente];
            detalleExistente.precioDetalle += precioDetalleAgregado;
            detalleExistente.cantidad += cantidadEntradas;
            listaActual[indexExistente] = detalleExistente;
            setListaDetalles(listaActual);
        } else {
            //const descuentoPeriodo = precioDetalle * (selectedPeriodo.porcentajeDescuento / 100);
            listaActual.push({
                cantidad: cantidadEntradas,
                precioDetalle: precioDetalleAgregado,
                tarifa: selectedTarifa,
                idPeriodo: periodo[0].idPeriodo //falta seleccionar periodo
            });
            setListaDetalles(listaActual);
        }
        setTotalDetalle(totalDetalle+precioDetalleAgregado);

        /*
        setMontoFinal((1+comision/100)*(totalDetalle+precioDetalle));
        setPrecioCalculado(precioCalculadoLocal);
        setPrecioDetalle(precioDetalleLocal);
        */

        setSelectedZona(null);
        setSelectedPeriodo(null);
        setCantidadEntradas(1);
    };
    
    return (
        <main className="buy-ticket">
            <div id="buy-ticket-data">
                <h1>Comprar ticket</h1>
                <section id="purchase_selection">
                        {/* LISTA DE PERIODOS */}
                        {periodo && periodo.length > 0 && (
                        <div className="mb-2">
                            <h2 className="text-xl font-semibold mb-3 text-gray-800">
                            Periodos disponibles
                            </h2>
                            <div>
                            <table className="min-w-full text-sm text-gray-700">
                                <thead className="bg-gray-100 text-gray-900">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium">Nombre</th>
                                    <th className="px-4 py-2 text-left font-medium">Fecha Inicio</th>
                                    <th className="px-4 py-2 text-left font-medium">Fecha Fin</th>                                    
                                    <th className="px-4 py-2 text-left font-medium">Descuento</th>                    
                                </tr>
                                </thead>
                                <tbody>
                                {periodo.map((p) => (
                                    <tr
                                    key={p.idPeriodo}
                                    className="border-t hover:bg-gray-50 transition-colors"
                                    >
                                    <td className="px-4 py-2">{p.nombre}</td>
                                    <td className="px-4 py-2">{p.fechaInicio}</td>
                                    <td className="px-4 py-2">{p.fechaFin}</td>                     
                                    <td className="px-4 py-2">
                                    {!p.tipoDesc || p.valorDescuento == null
                                        ? "-"
                                        : p.tipoDesc === "MONTO"
                                        ? `S/. ${p.valorDescuento}`
                                        : `${p.valorDescuento}%`}
                                    </td>

                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                        )}

                    <div className="data_purchase">
                        <div>
                            <h2>Zona</h2>                        
                            <DropdownOptions                        
                                options={zonas}
                                setSelectedOption={setSelectedZona}
                                selectedOption={selectedZona}    
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
                                nombre={['fechaInicio','horaInicio']}
                            />
                        </div>                         
                    </div>                
                    <div className="data_purchase">
                        {/*
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
                            */}
                        {selectedZona && selectedTipoEntrada? (
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
                    <button className='btn btn-secondary'
                        onClick={handleRegresar}
                    >
                        Regresar
                    </button>
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
                    montoFinal={totalDetalle}
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