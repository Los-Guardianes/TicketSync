import { apiFetch } from '../../../../globalServices/API';

export const postOrganizador = (organizador) =>
  apiFetch('/api/organizador', { method: 'POST', body: JSON.stringify(organizador) });

