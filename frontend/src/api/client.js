// In production (Vercel), API is proxied through the same domain via /api/*
// In development, change this to http://localhost:3000/api
const API_URL = import.meta.env.VITE_API_URL || '/api';
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
