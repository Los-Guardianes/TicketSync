import { apiFetch } from '../../../../globalServices/API';

export const getParams = () => apiFetch('/api/params');
export const putParams = (params, id) => {
  return apiFetch(`/api/params/${id}`, {
    method: "PUT",
    body: JSON.stringify(params),
  });
} 