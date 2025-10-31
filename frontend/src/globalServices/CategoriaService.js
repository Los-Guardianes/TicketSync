import { apiFetch } from './API';

// Obtener todas las categorías
export const getCategorias = () => apiFetch('/api/catevento');