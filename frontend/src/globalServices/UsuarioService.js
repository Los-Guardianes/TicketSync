import { apiFetch } from './API';

export const getByEmail = (email) => apiFetch(`/api/usuario/mail/${email}`);
export const getByTelefono = (tel) => apiFetch(`/api/usuario/tel/${tel}`);