import { apiFetch } from '../../../../globalServices/API';

export const postOrganizador = (organizador) =>
  apiFetch('/api/organizador/register', { method: 'POST', body: JSON.stringify(organizador) });

