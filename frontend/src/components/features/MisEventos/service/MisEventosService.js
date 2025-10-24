import { apiFetch } from '../../../../globalServices/API';

//De momento fetchea todos los eventos
export const getMisEventos = (idUser) => apiFetch(`/api/evento`);
//apiFetch(`/api/evento/user/${idUser}`);