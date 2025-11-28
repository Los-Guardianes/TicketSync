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

export const postTemporada = (temporada) =>
	apiFetch('/periodo', { method: 'POST', body: JSON.stringify(temporada) });

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
