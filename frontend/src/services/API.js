//src/services/API.js
const BASE_URL = 'http://localhost:8080';

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
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${txt}`);
  }
  return res.status !== 204 ? res.json().catch(() => null) : null;
}
