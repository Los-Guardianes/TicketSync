import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEventData } from "../service/useEventData"
import { useTicketCodigoDesc } from '../service/useTicketCodigoDesc'
import { useCompraTickets } from '../service/useCompraTickets'
import { ShoppingDetails } from '../components/ShoppingDetails'
import { InfoEventTicket } from '../components/InfoEventTicket'
import { Notification } from "../../../../components/common/Notification/Notification"
import { TableInfoEvent } from '../components/TableInfoEvent'
import "./TicketPurchase.css"
import { PurchaseTicket } from '../components/PurchaseTicket'
import { ApplyDiscount } from '../components/ApplyDiscount'
import { useNotification } from '../../../../context/NotificationContext'
export const TicketPurchase = () => {

    const {id} = useParams();


    const [selectedFuncion, setSelectedFuncion] = useState(null)

    const { 
        showNotification 
    } = useNotification()

    const navigate = useNavigate();
    const {
        zonas,
        periodos,
        evento,
        funciones,
        tipoEntradas,
        tarifas,
        periodoActual,    
    } = useEventData(id);

    const {
        formData,
        descuentoCodigo,
        handleFormData,
        handleAplicarCodigo,
        handleDeleteDiscount
    } = useTicketCodigoDesc()

    const {
        listaDetalles,
        totalBruto,        
        montoDescuentoPeriodo,        
        montoDescuentoCodigo,        
        total,
        updateCantidad
    } = useCompraTickets(periodoActual, descuentoCodigo, tarifas);

    const getNombre = (funcion) => {
        if(!funcion)return;
        const date = new Date(`${funcion.fechaInicio}T${funcion.horaInicio}`);
        return new Intl.DateTimeFormat("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
    }

    const handleContinueToPay = () => {
        //falta verificar que la listaDetalles no este vacia
        if(!selectedFuncion){
            showNotification("Seleccione almenos una funcion", "error")
            return
        }
        const cantCompras = listaDetalles.reduce((acc, det) => 
            acc += det.cantidad,0
        );
        if (cantCompras == 0){            
            showNotification("Seleccione almenos un ticket", "error")
            return;
        }
            navigate("/ticket-pay", { state: {
            listaDetalles: listaDetalles,
            idPeriodo: periodoActual.idPeriodo,
            totalBruto: totalBruto,
            descuentoAplicado: montoDescuentoPeriodo + montoDescuentoCodigo,
            total: total,
            funcion: selectedFuncion,
            idDescuentoUtilizado: descuentoCodigo?.idDescuento ?? null //Es opcional el descuento

        }});        
    }
    
    return (
        <main className="ticket-purchase-main">
            <div className="ticket-purchase-container">
                <div className="ticket-purchase-grid">
                    {/* Main Content */}
                    <div className='ticket-purchase-content'>
                        <TableInfoEvent 
                            periodos = {periodos}
                            zonas = {zonas}
                            funciones = {funciones}
                            tipoEntradas= {tipoEntradas}
                            tarifas={tarifas}
                        ></TableInfoEvent>
                        <section className="ticket-purchase-section">
                            <div className="ticket-header-selection">
                                <h3 className="">Selecciona tu ticket</h3>
                                <div className="dropdown-wrapper">
                                    <select
                                    className="dropdown-button"
                                    value={selectedFuncion ? selectedFuncion.idFuncion : ""}
                                    onChange={(e) => {
                                        const selected = funciones.find(
                                        (opt) => opt.idFuncion === parseInt(e.target.value)
                                        );
                                        if (selected) setSelectedFuncion(selected);
                                    }}
                                    >
                                    <option value="">Seleccionar función</option>
                                    {funciones.map((opt) => (
                                        <option key={opt.idFuncion} value={opt.idFuncion}>
                                        {getNombre(opt)}
                                        </option>
                                    ))}
                                    </select>
                                </div>
                                </div>

                            <ShoppingDetails 
                                listaDetalles={listaDetalles}
                                updateCantidad={updateCantidad}                                
                                maxCantidad={evento?.maxComprasTickets}
                            />
                        </section>
                    </div>
                    {/* Sidebar */}
                    <aside className="ticket-purchase-sidebar">
                        <section className="ticket-purchase-section">
                            <InfoEventTicket evento={evento}></InfoEventTicket>
                            <ApplyDiscount
                                formData={formData}
                                handleFormData={handleFormData}
                                handleAplicarCodigo={handleAplicarCodigo}
                                handleDeleteDiscount={handleDeleteDiscount}
                                descuentoCodigo={descuentoCodigo}
                            ></ApplyDiscount>
                            <PurchaseTicket
                                totalBruto={totalBruto}
                                montoDescuentoPeriodo={montoDescuentoPeriodo}
                                montoDescuentoCodigo={montoDescuentoCodigo}
                                periodo={periodoActual}
                                descuentoCodigo={descuentoCodigo}
                                total={total}
                            >
                            </PurchaseTicket>                                  
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