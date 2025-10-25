import { apiFetch } from './API';
//export const getCiudades = () => apiFetch('/api/ciudad');

export const getCiudades = () => apiFetch('/api/ciudad');
export const getDepartamentos = () => apiFetch('/api/dpto');
export const getCiudadesPorDpto = (id) => apiFetch(`/api/ciudad/dpto/${id}`);
