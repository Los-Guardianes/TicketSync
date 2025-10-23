import { apiFetch } from '../../../../globalServices/API';

export const getTickets = (idUser) => apiFetch(`/api/ticket/user/${idUser}`);
