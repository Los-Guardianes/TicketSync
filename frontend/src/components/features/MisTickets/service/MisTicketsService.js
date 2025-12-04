import { apiFetch } from '../../../../globalServices/API';
import { useState, useEffect } from 'react';

export const getTickets = (idUser) => apiFetch(`/api/ticket/user/${idUser}`);

/*
export const getTicketsByEvent = async (userId, idEvento) => {
   const all = await getTickets(userId);
   return (all || []).filter(t => String(t?.detalleCompra?.ordenCompra?.funcion?.evento?.idEvento) === String(idEvento));
};
*/

export const getOrdenByEvent = (userId, idEvento) =>
  apiFetch(`/api/orden/usuario/${userId}/evento/${idEvento}`);

export const getTicketByFuncionUser = (userId, idFuncion) =>
  apiFetch(`/api/miticket/usuario/${userId}/funcion/${idFuncion}`);


const toDate = (s) => {
  if (!s) return null;
  const str = String(s).trim();

  // 1) Formato YYYY-MM-DD o YYYY/MM/DD → parsear como fecha LOCAL
  let m = str.match(/^(\d{4})[\/-](\d{2})[\/-](\d{2})$/);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return isNaN(d) ? null : d;
  }

  // 2) Formato DD-MM-YYYY o DD/MM/YYYY → también como fecha LOCAL
  m = str.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
  if (m) {
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    return isNaN(d) ? null : d;
  }

  // 3) Otros formatos (con hora, etc.) → usar Date normal
  const d = new Date(str);
  return isNaN(d) ? null : d;
};


/** Construye filas por EVENTO (agrupando tickets del usuario por idEvento) */
export const buildEventRowsFromTickets = (tickets) => {
  const map = new Map();
  tickets.forEach(tk => {
    const oc = tk?.detalleCompra?.ordenCompra;
    const fn = oc?.funcion;
    const ev = fn?.evento;
    if (!ev?.idEvento) return;

    const evId = ev.idEvento;

    if (!map.has(evId)) {
      map.set(evId, {
        idEvento: evId,
        titulo: ev?.nombre ?? 'Evento',
        direccion: ev?.direccion ?? '',
        imagen: ev?.urlImagen ?? '',
        funciones: [], // ✅ FIX: array de objetos con fechaInicio y fechaFin/horaFin
        ticketsCount: 0,
      });
    }
    const entry = map.get(evId);
    entry.ticketsCount += 1;

    // ✅ FIX: Guardar tanto fecha de inicio como fecha/hora de fin
    if (fn?.fechaInicio) {
      entry.funciones.push({
        fechaInicio: fn.fechaInicio,
        fechaFin: fn.fechaFin || fn.fechaInicio,
        horaFin: fn.horaFin || fn.horaInicio
      });
    }
  });

  // ✅ FIX: Usar hora actual del navegador (timezone local)
  const ahora = new Date();

  const rows = Array.from(map.values()).map(r => {
    // Deduplicar funciones por fechaInicio
    const funcionesUnicas = [];
    const seen = new Set();
    r.funciones.forEach(fn => {
      const key = String(fn.fechaInicio);
      if (!seen.has(key)) {
        seen.add(key);
        funcionesUnicas.push(fn);
      }
    });

    // ✅ FIX: Clasificar funciones como futuras o pasadas basado en su HORA DE FIN
    const futuras = [];
    const pasadas = [];

    funcionesUnicas.forEach(fn => {
      const fechaInicioDate = toDate(fn.fechaInicio);
      if (!fechaInicioDate) return;

      // Construir DateTime de fin
      const fechaHoraFin = new Date(`${fn.fechaFin}T${fn.horaFin}`);

      // Comparar con hora de FIN, no solo fecha de inicio
      if (fechaHoraFin >= ahora) {
        futuras.push(fechaInicioDate);
      } else {
        pasadas.push(fechaInicioDate);
      }
    });

    futuras.sort((a, b) => a - b);
    pasadas.sort((a, b) => b - a);

    return {
      ...r,
      proximaFecha: futuras[0] || null,
      hayFuturas: futuras.length > 0,
      ultimaPasada: pasadas[0] || null,
    };
  });

  // Separamos: con próximas funciones vs solo pasadas
  const upcoming = rows
    .filter(r => r.hayFuturas)
    .sort((a, b) => a.proximaFecha - b.proximaFecha);

  const past = rows
    .filter(r => !r.hayFuturas)
    .sort((a, b) => b.ultimaPasada - a.ultimaPasada);

  return { upcoming, past };
};

export const usePagination = (items, pageSize, showAll) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [items, totalPages]);

  const visible = showAll ? items : items.slice((page - 1) * pageSize, page * pageSize);
  const showPager = !showAll && items.length > pageSize;

  return { visible, page, setPage, totalPages, showPager };
};