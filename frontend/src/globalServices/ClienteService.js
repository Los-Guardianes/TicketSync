import { apiFetch } from './API';

export const postClient = (cliente) =>
  apiFetch('/api/cliente/register', { method: 'POST', body: JSON.stringify(cliente) });
