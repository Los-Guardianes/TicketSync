import { apiFetch } from '../../../../globalServices/API';

export const getTickets = (idUser) => apiFetch(`/api/ticket/user/${idUser}`);

/*
export const getTicketsByEvent = async (userId, idEvento) => {
   const all = await getTickets(userId);
   return (all || []).filter(t => String(t?.detalleCompra?.ordenCompra?.funcion?.evento?.idEvento) === String(idEvento));
};
*/

export const getTicketsByEvent = (userId, idEvento) =>
  apiFetch(`/api/miticket/usuario/${userId}/evento/${idEvento}`);

