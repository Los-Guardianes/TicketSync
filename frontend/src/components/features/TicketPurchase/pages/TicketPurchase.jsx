import { use, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTicketPurchase } from "../service/useTicketPurchase"
import { DetalleCompra } from "../models/DetalleCompra"
import { DropdownOptions } from "../components/DropdownOptions"
import { TicketQuantitySelector } from '../components/TicketQuantitySelector'
import { ShoppingDetails } from '../components/ShoppingDetails'
import { InfoEventTicket } from '../components/InfoEventTicket'
import { Notification } from "../../../../components/common/Notification/Notification"

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

    const [notification, setNotification] = useState(null)

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
            setNotification({
                message: "Agrega al menos un detalle de compra antes de continuar.",
                type: "warning",
            });
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
            setNotification({
                message: "Selecciona una zona, un tipo de entrada y una función antes de agregar.",
                type: "warning",
            });
            return;
        }
        const selectedTarifa = tarifas.find(
            t => 
            t.tipoEntrada.idTipoEntrada === selectedTipoEntrada.idTipoEntrada &&
            t.zona.idZona === selectedZona.idZona
        );
        if (!selectedTarifa) {
            setNotification({
                message: "No se encontró una tarifa para la combinación seleccionada de zona y tipo de entrada.",
                type: "error",
            });
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
        <main className="ticket-purchase-main">
            <div className="ticket-purchase-container">

                {notification && (
                    <Notification
                    message={notification.message}
                    type={notification.type}
                    duration={3000}
                    onClose={() => setNotification(null)}
                    />
                )}

                <div className="ticket-purchase-grid">
                    {/* Main Content */}
                    <div className='ticket-purchase-content'>
                        <section className='ticket-purchase-section'>
                            {/* LISTA DE PERIODOS */}
                            {periodo && periodo.length > 0 && (
                            <div className="mb-2">
                                <h2 className="ticket-purchase-section-title">Periodos disponibles</h2>
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
                        </section>

                        <div className="ticket-purchase-section">
                            <h2 className="ticket-purchase-section-title">Selecciona tus entradas</h2>
                            <form className="purchase-form">
                                <fieldset className="purchase-form-grid">
                                    <div className="purchase-form-group">
                                        <label className="purchase-form-label">Zona</label>                       
                                        <DropdownOptions                        
                                            options={zonas}
                                            setSelectedOption={setSelectedZona}
                                            selectedOption={selectedZona}
                                        />
                                    </div>
                                    <div className="purchase-form-group">
                                        <label className="purchase-form-label">Tipo de entrada</label>
                                        <DropdownOptions                        
                                            options={tipoEntradas}
                                            setSelectedOption={setSelectedTipoEntrada}
                                            selectedOption={selectedTipoEntrada}
                                        />
                                    </div>
                                    <div className="purchase-form-group">
                                        <label className="purchase-form-label">Funciones</label>
                                        <DropdownOptions                        
                                            options={funciones}
                                            setSelectedOption={setSelectedFuncion}
                                            selectedOption={selectedFuncion}
                                            nombre={['fechaInicio','horaInicio']}
                                        />
                                    </div>
                                </fieldset>
                                <div className="data_purchase">
                                    {selectedZona && selectedTipoEntrada && selectedFuncion ? (
                                        <>
                                        <section className='ticket-purchase-grid'>
                                            <TicketQuantitySelector
                                                cantidadEntradas={cantidadEntradas}
                                                incrementar={incrementar}
                                                decrementar={decrementar}
                                            >
                                                <label className="purchase-form-label">Cantidad de entradas</label>
                                            </TicketQuantitySelector>
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
                                        </section>
                                        <button 
                                                    className='ticket-purchase-button
                                                    ticket-purchase-button-primary
                                                    ticket-purchase-button-full mt-4'
                                                    onClick={agregarIncrementarDetalle}
                                                >
                                                Agregar a carrito
                                            </button>
                                        </>           
                                    ) : null}
                                </div>
                            </form>                        
                        </div> 
                        <section className="ticket-purchase-section">
                            <h2 className="ticket-purchase-section-title">Tu carrito</h2>
                            <ShoppingDetails 
                                totalDetalle={totalDetalle}
                                listaDetalles={listaDetalles}
                            />
                        </section>
                    </div>
                    {/* Sidebar */}
                    <aside className="ticket-purchase-sidebar">
                        <section className="ticket-purchase-section">
                            <InfoEventTicket 
                                evento={evento}
                                montoFinal={totalDetalle}
                            />
                            <button 
                            className='ticket-purchase-button
                            ticket-purchase-button-primary
                            ticket-purchase-button-full'
                            onClick={handleContinueToPay}
                            >
                                Continuar al pago
                            </button>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    )
}