import { useEffect } from "react";
import { useState } from "react";
import { getTicketByFuncionUser, getOrdenByEvent } from "./MisTicketsService";
import { getEventosById } from "../../../../globalServices/EventoService";
import { apiFetch } from '../../../../globalServices/API';
export const useDetalleTickets = (idEvento, idUsuario) => {

    const [listaOrdenes, setListaOrdenes] = useState([]);
    const [ordenCompra, setOrdenCompra] = useState(null);

    const [evento, setEvento] = useState(null);
    const [funciones, setFunciones] = useState([]);
    const [cliente, setCliente] = useState(null);
    const [selectedFuncion, setSelectedFuncion] = useState(null);

    const [tarifas, setTarifas] = useState([]);
    const [periodos, setPeriodos] = useState([]);

    const seleccionarFuncion = (idSeleccionado) => {
        const funcion = funciones.find(
            (f) => f.idFuncion === parseInt(idSeleccionado)
        );
        setSelectedFuncion(funcion);
    };

    useEffect(() => {
        fetchOrdenCompraUsuario(idEvento, idUsuario);
        fetchEvento(idEvento);
        fetchFunciones(idEvento);
        fetchCliente(idUsuario);
        fetchPeriodo(idEvento);
        fetchTarifas(idEvento);
    }, [idEvento, idUsuario])

    useEffect(() => {
        if (funciones.length === 0) return;
        if (!selectedFuncion) setSelectedFuncion(funciones[0]);
    }, [funciones])

    useEffect(() => {
        if (!selectedFuncion) setOrdenCompra(listaOrdenes[0] || null);
        const ordenesFiltradas = listaOrdenes.filter(oc => oc.idFuncion === selectedFuncion?.idFuncion);
        setOrdenCompra(ordenesFiltradas[0] || null);
    }, [selectedFuncion, listaOrdenes])

    const obtenerNombre = (idTarifa, idPeriodo) => {
        const tarifa = tarifas.find(t => t.idTarifa === idTarifa);
        const periodo = periodos.find(p => p.idPeriodo === idPeriodo);
        if (!tarifa || !periodo) return "—";
        return `${tarifa.zonaDTO.nombre} - ${tarifa.tipoEntradaDTO.nombre} - ${periodo.nombre}`;
    }

    const fetchOrdenCompraUsuario = async (idEvento, idUsuario) => {
        const data = await getOrdenByEvent(idUsuario, idEvento);
        console.log("Ordenes de compra del usuario para el evento:", data);
        setListaOrdenes(data);
    }

    const fetchEvento = async (idEvento) => {
        const data = await getEventosById(idEvento);
        setEvento(data);
    }

    const fetchFunciones = async (idEvento) => {
        const data = await apiFetch(`/api/funcion/evento/${idEvento}`);
        setFunciones(data || []);
    }

    const fetchCliente = async (idUsuario) => {
        const data = await apiFetch(`/api/usuario/${idUsuario}`);
        setCliente(data);
    }

    const fetchPeriodo = async () => {
        const data = await apiFetch(`/api/periodo/evento/${idEvento}`);
        console.log("Periodos del evento:", data);
        setPeriodos(data || []);
    };

    const fetchTarifas = async () => {
        const data = await apiFetch(`/api/tarifa/evento/${idEvento}`);
        console.log("Tarifas del evento:", data);
        const tarifasParseadas = (data || []);
        setTarifas(tarifasParseadas);
    };

    const obtenerTickets = (idUsuario) => {
        return getTicketByFuncionUser(idUsuario, selectedFuncion?.idFuncion);
    }

    return {
        ordenCompra,
        evento,
        funciones,
        selectedFuncion,
        cliente,
        obtenerTickets,
        seleccionarFuncion,
        obtenerNombre
    }
};

