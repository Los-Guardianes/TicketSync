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



    // Calcula periodoActual cada vez que cambian periodos
    useEffect(() => {
        if (periodos && periodos.length > 0) {
            const actual = getPeriodoActual(periodos);
            setPeriodoActual(actual);
        } else {
            setPeriodoActual(null);
        }
    }, [periodos]);

    useEffect(()=>{
        //Se cargan todos los datos necesarios
        fetchEvento();
        fetchPeriodo();
        fetchFunciones();
        fetchTarifas();
        fetchZonas();
        fetchTipoEntradas();  
    },[idevento])

    const getPeriodoActual = (listaPeriodos) => {
        if (!listaPeriodos || listaPeriodos.length === 0) return null;
        const hoy = new Date();
        return listaPeriodos.find((p) => {
            const inicio = new Date(p.fechaInicio);
            const fin = new Date(p.fechaFin);
            return hoy >= inicio && hoy <= fin;
        }) || null;
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
        console.log("Funciones: ", data)
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
    };
}
