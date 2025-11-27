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
