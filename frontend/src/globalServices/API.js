//src/services/API.js
const BASE_URL = 'http://localhost:8080';
// const BASE_URL = 'https://api.tuticket.space';
export const getAuthHeader = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth') || 'null');
    return auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
  } catch { return {}; }
};

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),           // añade Bearer si existe
    ...(options.headers || {}),
  };
  console.log('Headers enviados:', headers);
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${txt}`);
  }
  return res.status !== 204 ? res.json().catch(() => null) : null;
};

export async function apiDownload(path) {
  const headers = {
    ...getAuthHeader(), // incluye el Bearer
  };
  console.log('Headers enviados:', headers);
  const res = await fetch(`${BASE_URL}${path}`, { method: 'GET', headers });

  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${txt}`);
  }

  return res.blob();
}

// --- INICIO DE LA NUEVA FUNCIÓN ---

/**
 * Función genérica para peticiones que envían FormData (ej. subida de archivos).
 * No añade 'Content-Type', el navegador lo hará.
 */
export async function apiFetchForm(path, formData) {
  const headers = {
    ...getAuthHeader(), // añade Bearer si existe
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: headers,
    body: formData, // Envía el objeto FormData directamente
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${txt}`);
  }
  return res.status !== 204 ? res.json().catch(() => null) : null;
}