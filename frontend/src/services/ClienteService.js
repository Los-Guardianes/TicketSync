import { apiFetch } from './API';

export const postClient = (cliente) =>
  apiFetch('/api/cliente', { method: 'POST', body: JSON.stringify(cliente) });
