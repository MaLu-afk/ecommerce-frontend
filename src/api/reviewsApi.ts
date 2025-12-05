// src/api/reviewsApi.ts
import { http } from './http';
import type { 
  CreateReviewPayload,
  Review 
} from '../types/productDetail';

/**
 * API para manejo de reseñas de productos
 */
export const reviewsApi = {
  /**
   * Crea una nueva reseña para un producto
   * @param payload - Datos completos de la reseña (producto_id, user_id, clasificacion, comentario)
   * @returns Promise con la reseña creada
   */
  createReview: async (payload: CreateReviewPayload): Promise<Review> => {
    try {
      const response = await http.post<Review>(
        `/productos/${payload.producto_id}/resenas`,
        {
          clasificacion: payload.clasificacion,
          comentario: payload.comentario,
          user_id: payload.user_id
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error en createReview:', error);
      throw error;
    }
  },

  /**
   * Actualiza una reseña existente
   * @param reviewId - ID de la reseña
   * @param payload - Datos a actualizar
   * @returns Promise con la reseña actualizada
   */
  updateReview: async (
    reviewId: number,
    payload: { clasificacion?: number; comentario?: string }
  ): Promise<Review> => {
    try {
      const response = await http.put<Review>(
        `/resenas/${reviewId}`,
        payload
      );
      return response;
    } catch (error) {
      console.error('Error en updateReview:', error);
      throw error;
    }
  },

  /**
   * Elimina una reseña
   * @param reviewId - ID de la reseña a eliminar
   * @returns Promise<void>
   */
  deleteReview: async (reviewId: number): Promise<void> => {
    try {
      await http.delete(`/resenas/${reviewId}`);
    } catch (error) {
      console.error('Error en deleteReview:', error);
      throw error;
    }
  }
};