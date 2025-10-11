import { apiFetch } from "../../../../services/API";

export const postOrdenCompra = (ordenCompra) =>
    apiFetch('/api/orden/completo', {method: 'POST',body: JSON.stringify(ordenCompra) });