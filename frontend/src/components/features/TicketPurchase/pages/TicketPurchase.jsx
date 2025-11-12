import { useNavigate, useParams } from 'react-router-dom'
import { useEventData } from "../service/useEventData"
import { useTicketCodigoDesc } from '../service/useTicketCodigoDesc'
import { useCompraTickets } from '../service/useCompraTickets'
import { ShoppingDetails } from '../components/ShoppingDetails'
import { InfoEventTicket } from '../components/InfoEventTicket'
import { TableInfoEvent } from '../components/TableInfoEvent'
import "./TicketPurchase.css"
import { PurchaseTicket } from '../components/PurchaseTicket'
import { ApplyDiscount } from '../components/ApplyDiscount'
import { useNotification } from '../../../../context/NotificationContext'
import { DropdownList } from '../../../common/DropDownList/DropDownList' 
export const TicketPurchase = () => {

    const {id} = useParams();
    
    const { showNotification } = useNotification()
    const navigate = useNavigate();

    const {
        zonas,
        periodos,
        evento,
        funciones,
        tipoEntradas,
        tarifas,
        periodoActual,
        selectedFuncion,        
        setSelectedFuncion,
        getMaxCantidadTickets,
        seleccionarFuncion
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
                <div className="ticket-purchase-info-event ticket-purchase-section">
                        <InfoEventTicket evento={evento}></InfoEventTicket>
                        <TableInfoEvent 
                            periodos = {periodos}
                            zonas = {zonas}
                            funciones = {funciones}
                            tipoEntradas= {tipoEntradas}
                            tarifas={tarifas}
                        >
                        </TableInfoEvent>
                </div>
                <div className="ticket-purchase-grid">
                    {/* Main Content */}
                    <div className='ticket-purchase-content'>

                        <section className="ticket-purchase-section">
                            <div className="ticket-header-selection">
                            <h3 className='ticket-purchase-section-title'>Selecciona tu ticket</h3>
                            <DropdownList
                                firstElement={"Selecciona una función"}
                                list={funciones}
                                id={"idFuncion"}
                                value={selectedFuncion ? selectedFuncion.idFuncion : ""}
                                onChangeOption={seleccionarFuncion}
                                getNombre={getNombre}
                            >                                
                            </DropdownList>
                            </div>

                            <ShoppingDetails 
                                listaDetalles={listaDetalles}
                                updateCantidad={updateCantidad}                                
                                getMaxCantidadTickets={getMaxCantidadTickets}
                                disabled = {selectedFuncion}
                            />
                        </section>
                    </div>
                    {/* Sidebar */}
                    <aside className="ticket-purchase-sidebar">
                        <section className="ticket-purchase-section">
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