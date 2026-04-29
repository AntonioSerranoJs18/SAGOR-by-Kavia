const BASE_URL = process.env.REACT_APP_API_URL || '/sagor-api';

export const api = {
  post: async (endpoint, body, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST', headers, body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
    return data;
  },

  get: async (endpoint, token = null) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
    return data;
  },

  put: async (endpoint, body, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT', headers, body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
    return data;
  },

  delete: async (endpoint, token = null) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${endpoint}`, { method: 'DELETE', headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
    return data;
  },
};

export const getToken = () => localStorage.getItem('sagor_token');
export const getUsuario = () => JSON.parse(localStorage.getItem('sagor_usuario') || 'null');

export const guardarSesion = (usuario, token) => {
  localStorage.setItem('sagor_token', token);
  localStorage.setItem('sagor_usuario', JSON.stringify(usuario));
};

export const cerrarSesion = () => {
  localStorage.removeItem('sagor_token');
  localStorage.removeItem('sagor_usuario');
};
