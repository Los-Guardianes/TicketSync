import { apiFetch } from './API';

// getEventos admite paginación opcional: limit y offset
export const getEventos = (limit, offset) => {
    let path = '/api/evento';
    const params = [];
    if (typeof limit !== 'undefined') params.push(`limit=${limit}`);
    if (typeof offset !== 'undefined') params.push(`offset=${offset}`);
    if (params.length) path += `?${params.join('&')}`;
    return apiFetch(path);
};
export const getEventosById = (id) => apiFetch(`/api/evento/${id}`);

export const getZonasByEvento = (id) => apiFetch(`/api/zona/evento/${id}`);

export const getFuncionesByEvento = (id) => apiFetch(`/api/funcion/evento/${id}`);

export const getEntradasByEvento = (id) => apiFetch(`/api/tipoentrada/evento/${id}`);

export const getPeriodosByEvento = (id) => apiFetch(`/api/periodo/evento/${id}`)

export const getCateventos = () => apiFetch('/api/catevento');

export const postEventoCompleto = (evento) =>
    apiFetch('/api/evento/completo', { method: 'POST', body: JSON.stringify(evento) });

export const getEventosByOrganizer = (idUsuario) =>
    apiFetch(`/api/evento/organizer/${idUsuario}`);

// Cancelar evento
export const cancelarEvento = (idEvento) =>
    apiFetch(`/api/evento/${idEvento}/cancelar`, {
        method: 'PUT',
    });

// Obtener inscritos por evento
export const getInscritosByEvento = (idEvento) =>
    apiFetch(`/api/ticket/evento/${idEvento}`);

// --- PERIODO ---

// Crear periodo
export const createPeriodo = (data) =>
    apiFetch('/api/periodo', {
        method: 'POST',
        body: JSON.stringify(data),
    });

// Actualizar periodo
export const updatePeriodo = (idPeriodo, data) =>
    apiFetch(`/api/periodo/${idPeriodo}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

// Eliminar periodo
export const deletePeriodo = (idPeriodo) =>
    apiFetch(`/api/periodo/${idPeriodo}`, {
        method: 'DELETE',
    });

// --- TIPO ENTRADA ---

export const createTipoEntrada = (data) =>
    apiFetch('/api/tipoentrada', {
        method: 'POST',
        body: JSON.stringify(data),
    });

export const updateTipoEntrada = (idTipoEntrada, data) =>
    apiFetch(`/api/tipoentrada/${idTipoEntrada}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

export const deleteTipoEntrada = (idTipoEntrada) =>
    apiFetch(`/api/tipoentrada/${idTipoEntrada}`, {
        method: 'DELETE',
    });

// --- ZONA ---

export const createZona = (data) =>
    apiFetch('/api/zona', {
        method: 'POST',
        body: JSON.stringify(data),
    });

export const updateZona = (idZona, data) =>
    apiFetch(`/api/zona/${idZona}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

export const deleteZona = (idZona) =>
    apiFetch(`/api/zona/${idZona}`, {
        method: 'DELETE',
    });

// --- FUNCION ---

export const createFuncion = (data) =>
    apiFetch('/api/funcion', {
        method: 'POST',
        body: JSON.stringify(data),
    });

export const updateFuncion = (idFuncion, data) =>
    apiFetch(`/api/funcion/${idFuncion}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

export const deleteFuncion = (idFuncion) =>
    apiFetch(`/api/funcion/${idFuncion}`, {
        method: 'DELETE',
    });
