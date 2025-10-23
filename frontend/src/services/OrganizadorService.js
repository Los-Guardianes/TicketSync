import { apiFetch } from './API';

export const postOrganizador = (organizador) =>
  apiFetch('/api/organizador', { method: 'POST', body: JSON.stringify(organizador) });

