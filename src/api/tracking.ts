// src/api/tracking.ts
import axios from 'axios';

// Crear cliente específico para tracking
const trackingHttp = axios.create({
  baseURL: import.meta.env.VITE_RECOMMENDATIONS_API_URL || 'http://localhost:8001',
  timeout: 10000,
  withCredentials: false,
});

// Función para obtener el token JWT de Python desde localStorage
const getPythonToken = (): string | null => {
  return localStorage.getItem('python_token');
};

// Interceptor para agregar el token JWT automáticamente
trackingHttp.interceptors.request.use(
  (config) => {
    const pythonToken = getPythonToken();
    if (pythonToken) {
      config.headers.Authorization = `Bearer ${pythonToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export type EventType = 'view' | 'click' | 'add_to_cart' | 'purchase';
export type ContextType = 'product_page' | 'home' | 'search' | 'recommendations' | 'cart';

export interface TrackingEvent {
  user_id?: number;
  session_id?: string;
  producto_id: number;
  tipo: EventType;
  contexto?: ContextType;
  metadatos?: any;
}

export const trackingService = {
  async trackEvent(event: TrackingEvent): Promise<void> {
    try {
      await trackingHttp.post('/api/v1/eventos/tracking', event);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  },

  async migrateSession(sessionId: string): Promise<void> {
    // El user_id se extrae automáticamente del JWT token
    // que se envía en el header Authorization
    await trackingHttp.post('/api/v1/eventos/migrar-sesion', {
      session_id: sessionId
    });
  },
};