// useTicketSelection.js
import { useEffect, useState } from 'react';
import { getEventosById } from "../../../../globalServices/EventoService";
import { apiFetch } from '../../../../globalServices/API';
import { Tarifa } from '../models/Tarifa';
import { Zona } from '../models/Zona';
import { TipoEntrada } from '../models/TipoEntrada';

export const useEventData = (idevento) => {

    const [periodoActual, setPeriodoActual] = useState(null);
    const [periodos, setPeriodos] = useState([]);
    const [funciones, setFunciones] = useState([]);
    const [evento, setEvento] = useState(null);
    const [tarifas, setTarifas] = useState([]);
    const [tipoEntradas, setTipoEntradas] = useState([]);
    const [zonas, setZonas] = useState([]);
    const [zonaxfuncion, setZonaxfuncion] = useState([]) 

    const [selectedFuncion, setSelectedFuncion] = useState(null)
    // Calcula periodoActual cada vez que cambian periodos
    useEffect(() => {
        if (periodos && periodos.length > 0) {
            const actual = getPeriodoActual(periodos);
            setPeriodoActual(actual);
        } else {
            setPeriodoActual(null);
        }
    }, [periodos]);


    const seleccionarFuncion = (idSeleccionado) => {
    const funcion = funciones.find(
        (f) => f.idFuncion === parseInt(idSeleccionado)
    );
    setSelectedFuncion(funcion);
    };


    const getMaxCantidadTickets = (zona) => {
        //Aquí se calcula el máximo de tickets por zona que se pueden comprar, limitado a su vez por la cantidad máxima de compra de tickets que el evento permite
        if(!selectedFuncion)return;
        const zxf = zonaxfuncion.find(zf => zf.idZona === zona.idZona && zf.idFuncion ===  selectedFuncion?.idFuncion)
        const entradasDisponibles = zona.aforo - zxf.comprasActuales;
        const maxComprasEvento = evento?.maxComprasTickets
        const maxCantidad = maxComprasEvento >= (entradasDisponibles >= 0 ? entradasDisponibles : 0) ? entradasDisponibles : maxComprasEvento //devuelve el menor
        return maxCantidad
    }

    useEffect(()=>{
        //Se cargan todos los datos necesarios
        fetchEvento();
        fetchPeriodo();
        fetchFunciones();
        fetchTarifas();
        fetchZonas();
        fetchTipoEntradas();
        fetchZonaxfuncion();
    },[idevento])

    const getPeriodoActual = (listaPeriodos) => {
        if (!listaPeriodos || listaPeriodos.length === 0) return null;                  
        // Obtener la fecha actual como cadena en la zona horaria de Perú
        const now = new Date();
        const hoyPeru = new Date(now.toLocaleString("en-US", { timeZone: "America/Lima" }));
        return listaPeriodos.find((p) => {
            const inicio = new Date(p.fechaInicio);
            const fin = new Date(p.fechaFin);
            return hoyPeru >= inicio && hoyPeru <= fin;
        }) || null;
    }

    const fetchZonaxfuncion = async () => {
        const data = await apiFetch(`/api/zonaxfuncion/evento/${idevento}`)
        setZonaxfuncion(data);
    }

    const fetchEvento = async () => {
        const data = await getEventosById(idevento);
        setEvento(data);
    };

    const fetchPeriodo = async () => {
        const data = await apiFetch(`/api/periodo/evento/${idevento}`);        
        setPeriodos(data || []);
    };

    const fetchTarifas = async () => {
        const data = await apiFetch(`/api/tarifa/evento/${idevento}`);
        const tarifasParseadas = (data || []).map(t => Tarifa.fromApi(t));
        setTarifas(tarifasParseadas);
    };

    const fetchFunciones = async () => {
        const data = await apiFetch(`/api/funcion/evento/${idevento}`);
        setFunciones(data || []);
    }

    const fetchZonas = async () => {
        const data = await apiFetch(`/api/zona/evento/${idevento}`);
        const zonasParseadas = (data || []).map(z => Zona.fromApi(z));
        setZonas(zonasParseadas);
    }

    const fetchTipoEntradas = async () => {
        const data = await apiFetch(`/api/tipoentrada/evento/${idevento}`);
        const tiposParseadas = (data || []).map(te => TipoEntrada.fromApi(te));        
        setTipoEntradas(tiposParseadas);
    }
    

    return {
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
    };
}
