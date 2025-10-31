import { apiFetch } from '../../../../globalServices/API';

export const postDescuento = (descuentosArray) =>
  apiFetch('/api/descuento/bulk', {
    method: 'POST',
    body: JSON.stringify(descuentosArray),
  });

export const getDescuentosActivosByEvento = (idEvento) =>
  apiFetch(`/api/descuento/evento/${idEvento}/activos`);
