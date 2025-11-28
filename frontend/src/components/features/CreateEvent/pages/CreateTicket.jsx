import { useNavigate } from "react-router-dom";
import { useEventCreation } from "../../../../context/EventCreationContext";
import "./CreateTicket.css";

// Services
import { useTemporadas } from "../services/useTemporadas";
import { useZonas } from "../services/useZonas";
import { useEntradas } from "../services/useEntradas";
import { useEvento } from "../services/useEvento";
import { useAuth } from '../../../../context/AuthContext';
// Components
import { HeaderEvent } from "./Componentes/HeaderEvent";

import { ConfigGeneral } from "../components/CreatTicketComponents/ConfigGeneral/ConfigGeneral";
import { TemporadasSection } from "../components/CreatTicketComponents/TemporadasSection/TemporadasSection";
import { ZonasSection } from "../components/CreatTicketComponents/ZonasSection/ZonasSection";
import { EntradasSection } from "../components/CreatTicketComponents/EntradasSection/EntradasSection";
import { ModalZona } from "../components/CreatTicketComponents/ModalZona/ModalZona";
import { ModalTipoEntrada } from "../components/CreatTicketComponents/ModalTipoEntrada/ModalTipoEntrada";
import { ModalTemporada } from "../components/CreatTicketComponents/ModalTemporada/ModalTemporada";

export const CreateTicket = () => {
    const { user } = useAuth();
        console.log("Usuario actual:", user);
        //arreglar para que la verificación sí funcione
        if (user === false) {
            return (
                <div style={{ padding: 16 }}>
                    <h2>Verificación de Organizador Pendiente</h2>
                    <p>Tu cuenta de organizador aún no ha sido verificada. Por favor, espera a que un administrador revise y apruebe tu solicitud.</p>
                    <p>Una vez que tu cuenta sea verificada, podrás crear eventos en la plataforma.</p>
                </div>
            );
        }
    const navigate = useNavigate();
    const { eventData, updateEventData } = useEventCreation();

    const currentMoneda = eventData.moneda || "SOL";

    // Custom Hooks
    const temporadas = useTemporadas(eventData, updateEventData);
    const zonas = useZonas(eventData, updateEventData);
    const entradas = useEntradas(eventData, updateEventData, currentMoneda);
    const evento = useEvento(eventData, updateEventData, navigate);

    return (
        <div className="crear-ticket-container">
            {/* Header */}
            <HeaderEvent currentStep={3} />
            <div className="header">
                {/* <span className="step">3</span>
                <h2>Crear Entradas</h2> */}
            </div>

            <ConfigGeneral
                currentMoneda={currentMoneda}
                handleMonedaChange={evento.handleMonedaChange}
                maxComprasTicket={eventData.maxComprasTicket}
                handleMaxComprasChange={evento.handleMaxComprasChange}
            />

            <div className="sections-container">
                <TemporadasSection
                    eventData={eventData}
                    temporadaActual={temporadas.temporadaActual}
                    onEliminarTemporada={temporadas.handleEliminarTemporada}
                    onAbrirModalTemporada={temporadas.abrirModalTemporada}
                />

                <ZonasSection
                    eventData={eventData}
                    onAbrirModalZona={zonas.abrirModalZona}
                    onEliminarZona={zonas.eliminarZona}
                />
            </div>
            
            <EntradasSection
                eventData={eventData}
                eliminarTipoEntrada={entradas.eliminarTipoEntrada} // ✅ Asegúrate de que esta función exista
                currentMoneda={currentMoneda}
                onAbrirModalTipoEntrada={entradas.abrirModalTipoEntrada}
            />

            {/* BOTONES DE ACCIÓN */}
            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => navigate("/ubicacion-evento")}>
                    Regresar
                </button>
                <button 
                    type="button" 
                    className="btn-primary" 
                    onClick={evento.handleFinalSubmit}
                    disabled={evento.isLoading}
                >
                    {evento.isLoading ? 'Guardando...' : 'Finalizar'}
                </button>
            </div>

            {/* MODALES */}
            <ModalZona
                isOpen={zonas.modalZonaAbierto}
                onClose={() => zonas.setModalZonaAbierto(false)}
                nuevaZona={zonas.nuevaZona}
                setNuevaZona={zonas.setNuevaZona}
                handleAgregarZona={zonas.handleAgregarZona}
                setModalZonaAbierto={zonas.setModalZonaAbierto}
            />

            <ModalTipoEntrada
                isOpen={entradas.modalTipoEntradaAbierto}
                onClose={() => entradas.setModalTipoEntradaAbierto(false)}
                nuevoTipoEntrada={entradas.nuevoTipoEntrada}
                setNuevoTipoEntrada={entradas.setNuevoTipoEntrada}
                handleAgregarTipoEntrada={entradas.handleAgregarTipoEntrada}
                setModalTipoEntradaAbierto={entradas.setModalTipoEntradaAbierto}
                eventData={eventData}
                currentMoneda={currentMoneda}
                onHandleAsignarPrecioZona={entradas.handleAsignarPrecioZona}
            />

            <ModalTemporada
                isOpen={temporadas.modalTemporadaAbierto}
                onClose={() => temporadas.setModalTemporadaAbierto(false)}
                currentMoneda={currentMoneda}
                nuevaTemporada={temporadas.nuevaTemporada}
                setNuevaTemporada={temporadas.setNuevaTemporada}
                handleAgregarTemporada={temporadas.handleAgregarTemporada}
                handleModificarTemporada={temporadas.handleModificarTemporada}
                isEditMode={temporadas.indiceEditando !== null}
            />
        </div>
    );
};
