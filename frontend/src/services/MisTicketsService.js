import { apiFetch } from './API';

export const getTickets = (idUser) => apiFetch(`/api/ticket/user/${idUser}`);
