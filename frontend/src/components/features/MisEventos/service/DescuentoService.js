import { apiFetch } from '../../../../globalServices/API';

export const postDescuento = (dscto) =>
  apiFetch('/api/descuento', { method: 'POST', body: JSON.stringify(dscto) });