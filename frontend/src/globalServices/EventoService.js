import { apiFetch } from './API';

export const getEventos     = () => apiFetch('/api/evento');
export const getEventosById = (id) => apiFetch(`/api/evento/${id}`);

export const getCateventos = () => apiFetch('/api/catevento');

export const postEventoCompleto = (evento) =>
  apiFetch('/api/evento/completo', { method: 'POST', body: JSON.stringify(evento) });

export const getEventosByOrganizer = (idUsuario) =>
  apiFetch(`/api/evento/organizer/${idUsuario}`);
