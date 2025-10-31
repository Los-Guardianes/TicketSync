import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTicketSelection } from "../service/useTicketSelection"
import { useCompraTickets } from '../service/useCompraTickets'
import { DropdownOptions } from "../components/DropdownOptions"
import { ShoppingDetails } from '../components/ShoppingDetails'
import { InfoEventTicket } from '../components/InfoEventTicket'
import { Notification } from "../../../../components/common/Notification/Notification"
import { getDescuentoByCodigo } from '../../../../globalServices/DescuentoService'

import "./TicketPurchase.css"

export const TicketPurchase = () => {

    const {id} = useParams();
    const [selectedZona, setSelectedZona] = useState(null);
    const [selectedFuncion, setSelectedFuncion] = useState(null)
    const [selectedTipoEntrada, setSelectedTipoEntrada] = useState(null);    
    const [notification, setNotification] = useState(null)

    const [formData, setFormData] = useState({discount: ''});
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const navigate = useNavigate();


    const {
        zonas,
        periodos,
        evento,
        funciones,
        tipoEntradas,
        tarifas,
        periodoActual,
        fetchZonas,
        fetchTipoEntradas,
        fetchPeriodo,
        fetchEvento,
        fetchFunciones,
        fetchTarifas
    } = useTicketSelection(id);

    const {
        listaDetalles,
        totalBruto,        
        montoDescuentoPeriodo,        
        montoDescuentoCodigo,    
        total,
        addDetalle,
        updateCantidad,
        removeDetalle,
        verificarDescuentoCodigo,
        getDescuentoId
    } = useCompraTickets(periodoActual, id);

 
    useEffect(() => {
        fetchEvento();
        fetchPeriodo();
        fetchFunciones();
        fetchTarifas();
        fetchZonas();
        fetchTipoEntradas();    
    }, [id]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleDiscount = async (e) => {
        e.preventDefault();
        const codigo = formData.discount;
        console.log(codigo)
        if (!codigo) {
            setNotification({
                message: "Por favor, ingresa un código de descuento.",
                type: "warning",
            });
            return;
        }
        try {
            const descuento =  await verificarDescuentoCodigo(codigo);
            console.log("resputesa: ", descuento)
            if (!descuento) {                            
                setNotification({
                    message: "Código de descuento inválido.",
                    type: "error",
                });
            }else{
                setNotification({
                    message: "Código de descuento válido.",
                    type: "success",
                })
            }
        } catch (error) {
            console.error("Error al verificar el código de descuento:", error);
            setNotification({
                message: "Error al verificar el código de descuento.",
                type: "error",
            });
        }
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
        console.log("Antes de pagar el periodo es:", periodoActual)
        navigate("/ticket-pay", { state: {
            listaDetalles: listaDetalles,
            idPeriodo: periodoActual.idPeriodo,
            totalBruto: totalBruto,
            descuentoAplicado: montoDescuentoPeriodo + montoDescuentoCodigo,
            total: total,
            funcion: selectedFuncion,
            idDescuentoUtilizado: getDescuentoId()
        }});
    }

    const handleAddDetalle = () => {
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
        addDetalle(selectedTarifa);         
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
                            {periodos && periodos.length > 0 && (
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
                                    {periodos.map((p) => (
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
                                        <button type='button'
                                            className='ticket-purchase-button
                                            ticket-purchase-button-primary
                                            ticket-purchase-button-full mt-4'
                                            onClick={handleAddDetalle}
                                        >
                                            Agregar a carrito
                                        </button>
                                        <section className='ticket-purchase-grid'>
                                            {
                                                <div>                    
                                                    <h2>Canjear código</h2>
                                                    <div className="form-discount">
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
                                                            type="button" 
                                                            className='btn btn-secondary btn-lg mt-3'
                                                            disabled={isLoading}
                                                            onClick={handleDiscount}
                                                        >
                                                            {isLoading ? 'Verificando...' : 'Aplicar'}
                                                        </button>
                                                    </div>                        
                                                    {errors.discount && <div className="error-form">{errors.discount}</div>}
                                                </div>
                                            }
                                        </section>
                                        </>           
                                    ) : null}
                                </div>
                            </form>                        
                        </div> 
                        <section className="ticket-purchase-section">
                            <h2 className="ticket-purchase-section-title">Tu carrito</h2>
                            <ShoppingDetails 
                                listaDetalles={listaDetalles}
                                updateCantidad={updateCantidad}
                                removeDetalle={removeDetalle}
                                maxCantidad={evento?.maxComprasTickets}
                            />
                        </section>
                    </div>
                    {/* Sidebar */}
                    <aside className="ticket-purchase-sidebar">
                        <section className="ticket-purchase-section">
                            <InfoEventTicket 
                                evento={evento}
                                totalBruto={totalBruto}
                                montoDescuentoPeriodo={montoDescuentoPeriodo}
                                montoDescuentoCodigo={montoDescuentoCodigo}
                                total={total}
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