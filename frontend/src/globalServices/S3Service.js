import { apiFetchForm } from './API';

//Llama a apiFetchForm y pasa el formData directamente.
//El 'method: POST' ya está incluido en apiFetchForm.
export const postSubirImagen = (formData) =>
  apiFetchForm('/api/subirImagens3', formData);