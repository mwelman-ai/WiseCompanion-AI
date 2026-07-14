const API_BASE = import.meta.env.VITE_API_URL || 'https://wisecompanion-api.onrender.com';

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem('wctoken');
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
}
