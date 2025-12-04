import { apiFetch } from '../../../../globalServices/API';

export const getCategorias = async () => {
    return apiFetch('/api/catevento', {
        method: 'GET'
    });
};

export const getCategoriaById = async (id) => {
    return apiFetch(`/api/catevento/${id}`, {
        method: 'GET'
    });
};

export const postCategoria = async (data) => {
    return apiFetch('/api/catevento', {
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export const putCategoria = async (data, id) => {
    return apiFetch(`/api/catevento/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
};

export const deleteCategoria = async (id) => {
    return apiFetch(`/api/catevento/${id}`, {
        method: 'DELETE'
    });
};
