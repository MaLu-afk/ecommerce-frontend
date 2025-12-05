// src/api/recommendations.ts
import axios from 'axios';

// Cliente específico para el servicio
const recommendationsHttp = axios.create({
  baseURL: import.meta.env.VITE_RECOMMENDATIONS_API_URL || 'http://localhost:8001',
  timeout: 10000,
  withCredentials: false,
});

// Función para obtener el token JWT de Python desde localStorage
const getPythonToken = (): string | null => {
  return localStorage.getItem('python_token');
};

// Interceptor para agregar el token JWT automáticamente
recommendationsHttp.interceptors.request.use(
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

export interface RecommendationRequest {
  user_id?: number;
  session_id?: string;
  top_n?: number;
  producto_id?: number;
}

export interface ProductoRecomendado {
  id: number;
  nombre: string;
  precio: number;
  categoria_id: number;
  imagen_url?: string;
  score: number;
}

export interface RecommendationResponse {
  productos: ProductoRecomendado[];
  total: number;
  algoritmo: string;
  metadatos?: any;
}

export const recommendationService = {
  async getHomeRecommendations(data: RecommendationRequest): Promise<RecommendationResponse> {
    const response = await recommendationsHttp.post('/api/v1/recomendaciones/home', data);
    return response.data;
  },

  async getProductRecommendations(data: RecommendationRequest & { producto_id: number }): Promise<RecommendationResponse> {
    const response = await recommendationsHttp.post('/api/v1/recomendaciones/producto', data);
    return response.data;
  },

  async getUserRecommendations(data: RecommendationRequest): Promise<RecommendationResponse> {
    const response = await recommendationsHttp.post('/api/v1/recomendaciones/usuario', data);
    return response.data;
  },
};