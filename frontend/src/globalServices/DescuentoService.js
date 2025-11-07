import { apiFetch } from './API';

export const postDescuento = (dscto) =>
  apiFetch('/api/descuento', { method: 'POST', body: JSON.stringify(dscto) });
export const getDescuentos = () => apiFetch(`/api/descuento`);

export const getDescuentoByCodigo = (codigo) => 
  apiFetch(`/api/descuento/verify?codigo=${codigo}`);
