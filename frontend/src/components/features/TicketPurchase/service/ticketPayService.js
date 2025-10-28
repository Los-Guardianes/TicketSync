import { apiFetch } from "../../../../globalServices/API";

export const postOrdenCompra = (ordenCompra) =>
    apiFetch('/api/orden/completo', {method: 'POST',body: JSON.stringify(ordenCompra) });