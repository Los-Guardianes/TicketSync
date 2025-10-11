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
