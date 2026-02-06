const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  return data;
}

export const auth = {
  register: (email: string, password: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
};

export const notes = {
  list: () => request('/notes'),
  get: (id: number) => request(`/notes/${id}`),
  create: (title?: string, content?: string) =>
    request('/notes', { method: 'POST', body: JSON.stringify({ title, content }) }),
  update: (id: number, data: { title?: string; content?: string }) =>
    request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request(`/notes/${id}`, { method: 'DELETE' }),
  search: (q: string) => request(`/notes/search?q=${encodeURIComponent(q)}`),
};
