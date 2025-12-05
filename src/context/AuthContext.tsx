// src/context/AuthContext.tsx
import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { setAuthHeader } from '../api/http';
import { me, logout as logoutApi } from '../api/auth';
import { trackingService } from '../api/tracking';
import { pythonTokenService } from '../api/pythonToken';
import type { User } from '../api/auth';

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setSession: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem('guest_cart');

    // Limpiar token de Python
    pythonTokenService.clearPythonToken();

    // Generar nueva sesión anónima al hacer logout
    const newSessionId = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    localStorage.setItem('session_id', newSessionId);

    setAuthHeader(null);
  }, []);

  // Función para obtener token de Python
  const obtainPythonToken = useCallback(async () => {
    try {
      const response = await pythonTokenService.requestPythonToken();
      pythonTokenService.savePythonToken(response.python_token, response.expires_at);
      console.log('✅ Token de Python obtenido y guardado');
      return response.python_token;
    } catch (error) {
      console.error('❌ Error al obtener token de Python:', error);
      return null;
    }
  }, []);

  // Función para migrar sesión (ahora usa JWT)
  const migrateSessionToUser = useCallback(async () => {
    const sessionId = localStorage.getItem('session_id');

    if (sessionId) {
      try {
        // Migrar sesión usando el JWT token
        // El token se agrega automáticamente por el interceptor
        // El user_id se extrae del JWT en el backend
        await trackingService.migrateSession(sessionId);
        console.log('✅ Sesión migrada correctamente usando JWT');

        // Limpiar session_id después de migrar
        localStorage.removeItem('session_id');
      } catch (error) {
        console.error('❌ Error al migrar sesión:', error);
      }
    }
  }, []);

  const setSession = useCallback(async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setAuthHeader(newToken);

    // Solo intentar migración si el usuario es 'cliente'
    if (newUser.rol === 'cliente') {
      // Obtener token de Python para este usuario
      const pythonToken = await obtainPythonToken();

      if (pythonToken) {
        // Migrar sesión anónima a usuario logueado usando JWT
        // El token ya está guardado en localStorage, el interceptor lo usará
        await migrateSessionToUser();
      }
    } else {
      console.log('ℹ️ Usuario no es cliente, omitiendo migración de sesión');
      // Limpiar session_id ya que no se migrará
      localStorage.removeItem('session_id');
    }
  }, [migrateSessionToUser, obtainPythonToken]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      handleLogout();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }, [handleLogout]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, []);

  // Restaurar sesión
  useEffect(() => {
    const savedToken =
      localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
    const savedUser =
      localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setToken(savedToken);
        setUser(parsedUser);
        setAuthHeader(savedToken);

        me()
          .then((u: User) => {
            setUser(u);
            localStorage.setItem(USER_KEY, JSON.stringify(u));
          })
          .catch(() => handleLogout())
          .finally(() => setIsLoading(false));
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        handleLogout();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [handleLogout]);

  // Asegurar que siempre haya session_id para usuarios anónimos
  useEffect(() => {
    if (!user && !localStorage.getItem('session_id')) {
      const sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('session_id', sessionId);
      console.log('🆔 Session ID generado para usuario anónimo:', sessionId);
    }
  }, [user]);

  // sincronizar logout entre pestañas
  useEffect(() => {
    const syncLogout = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY && !e.newValue) handleLogout();
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, [handleLogout]);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      token,
      isLoading,
      setSession,
      logout,
      updateUser,
      isAuthenticated: !!user && !!token,
      isAdmin: user?.rol === 'admin',
    }),
    [user, token, isLoading, setSession, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}