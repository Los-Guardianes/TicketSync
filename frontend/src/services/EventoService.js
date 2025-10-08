import { apiFetch } from './API';

export const getEventos     = () => apiFetch('/api/evento');
export const getEventosById = (id) => apiFetch(`/api/evento/${id}`);
