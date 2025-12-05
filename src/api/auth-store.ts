import { setAuthHeader } from './http';

export type Role = 'admin' | 'cliente';
export type AppUser = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Role;
  fecha_creacion?: string;
  password_must_change?: boolean;
};

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

// --- utils ---
function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}
function getStore() {
  // Prioriza localStorage; si no hay, usa sessionStorage (para “no recordar”)
  return {
    token: localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY),
    user:  localStorage.getItem(USER_KEY)  ?? sessionStorage.getItem(USER_KEY),
  };
}

// --- set/get ---
export function setToken(t: string | null, remember = true) {
  const L = remember ? localStorage : sessionStorage;
  if (t) L.setItem(TOKEN_KEY, t);
  else {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }
  setAuthHeader(t ?? null);
}

export function getToken(): string | null {
  const { token } = getStore();
  return token ?? null;
}

export function setUser(u: AppUser | null, remember = true) {
  const L = remember ? localStorage : sessionStorage;
  if (u) L.setItem(USER_KEY, JSON.stringify(u));
  else {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
}

export function getUser(): AppUser | null {
  const { user } = getStore();
  return safeParse<AppUser>(user);
}

// --- helpers ---
export function isLoggedIn() { return !!getToken(); }
export function hasRole(role: Role)   { return getUser()?.rol === role; }
export function updateUser(patch: Partial<AppUser>) {
  const current = getUser();
  if (!current) return;
  // Conserva “remember” detectando dónde estaba guardado
  const inLocal = !!localStorage.getItem(USER_KEY);
  const merged = { ...current, ...patch };
  setUser(merged, inLocal);
}

// Cierra sesión en ambos storages y quita el header
export function logout() {
  setToken(null);
  setUser(null);
}

// Llamar una vez al iniciar la app (por ej. en main.tsx)
export function bootstrap() {
  const t = getToken();
  setAuthHeader(t ?? null);

  // sincroniza cierre de sesión entre pestañas
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === TOKEN_KEY || e.key === USER_KEY) {
        const newToken = getToken();
        setAuthHeader(newToken ?? null);
      }
    });
  }
}