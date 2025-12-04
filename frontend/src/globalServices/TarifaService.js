import { apiFetch } from './API';

export const getTarifasByEvento = async (idEvento) => {
    return apiFetch(`/api/tarifa/evento/${idEvento}`);
};

export const createTarifa = async (tarifaData) => {
    return apiFetch(`/api/tarifa`, {
        method: 'POST',
        body: JSON.stringify(tarifaData)
    });
};

export const updateTarifa = async (idTarifa, tarifaData) => {
    return apiFetch(`/api/tarifa/${idTarifa}`, {
        method: 'PUT',
        body: JSON.stringify(tarifaData)
    });
};

export const deleteTarifa = async (idTarifa) => {
    return apiFetch(`/api/tarifa/${idTarifa}`, {
        method: 'DELETE'
    });
};

export const toggleActivoTarifa = async (idTarifa) => {
    return apiFetch(`/api/tarifa/${idTarifa}/toggle-activo`, {
        method: 'PATCH'
    });
};
