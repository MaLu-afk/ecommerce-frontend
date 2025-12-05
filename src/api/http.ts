//src/api/http.ts
import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

// Restaurar token si existe
const saved = localStorage.getItem('auth_token');
if (saved) {
  http.defaults.headers.common.Authorization = `Bearer ${saved}`;
}

// Helper por si quieres actualizarlo en runtime
export function setAuthHeader(token: string | null) {
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete http.defaults.headers.common.Authorization;
}
