// dsw-front-react/src/api/auth.ts
import { http, setAuthHeader } from './http';

export type User = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'cliente';
};

type LoginResponse = { token: string; user: User };

export async function login(email: string, password: string, remember = false) {
  const { data } = await http.post<LoginResponse>('/login', { email, password, remember });

  // Guardar y preparar cliente HTTP
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  setAuthHeader(data.token);

  return data; // <- { token, user }
}

export async function register(payload: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  const { data } = await http.post<LoginResponse>('/register', payload);
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  setAuthHeader(data.token);
  return data;
}

export async function updateUser(payload: {
  id: number;
  nombre?: string;
  apellido?: string;
  password?: string;
  address?: string | null;
  image?: string | null;
  phone?: string | null;
}) {
  const token = localStorage.getItem('auth_token');

  const { data } = await http.put(`/updateUser/${payload.id}`, payload,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  setAuthHeader(data.token);
  return data;
}

export async function me() {
  const { data } = await http.get<User>('/user');
  return data;
}

export async function logout() {
  try { await http.post('/logout'); } catch {}
  setAuthHeader(null);
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}