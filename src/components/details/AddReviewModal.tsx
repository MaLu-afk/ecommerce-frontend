// src/components/details/AddReviewModal.tsx
import { useState } from "react";
import axios from 'axios';
import type { Review, Rating, CreateReviewPayload } from "../../types/productDetail";
import { reviewsApi } from "../../api/reviewsApi";

interface AddReviewModalProps {
  onClose: () => void;
  productId: number;
  userId: number;
  onSubmit?: (review: Review) => void;
}

/**
 * Modal para agregar una nueva reseña
 * Incluye calificación con estrellas y campo de comentario
 */
export default function AddReviewModal({
  onClose,
  productId,
  userId,
  onSubmit
}: AddReviewModalProps) {
  const [rating, setRating] = useState<Rating | 0>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comentario, setComentario] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Por favor selecciona una calificación");
      return;
    }

    if (comentario.trim().length < 10) {
      setError("El comentario debe tener al menos 10 caracteres");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateReviewPayload = {
        producto_id: productId,
        user_id: userId,
        clasificacion: rating as Rating,
        comentario: comentario.trim()
      };

      const newReview = await reviewsApi.createReview(payload);

      onSubmit?.(newReview);
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422) {
          setError(err.response.data?.message || "Ya has comentado este producto");
        } else if (err.response?.status === 401) {
          setError("Debes iniciar sesión para agregar una reseña");
        } else {
          setError("Error al enviar la reseña. Intenta de nuevo");
        }
      } else {
        setError("Error inesperado. Intenta de nuevo");
      }

      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-[550px] max-h-[90vh] overflow-y-auto animate-slideUp">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b-2 border-gray-200">
          <h2 className="m-0 text-2xl font-bold text-gray-900 font-poppins">
            Agregar reseña
          </h2>
          <button
            className="bg-none border-none text-3xl text-gray-500 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-7">

          {/* Sistema de estrellas */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 font-poppins mb-2.5">
              Calificación <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-4xl cursor-pointer p-0 bg-none border-none transition-all duration-200 hover:scale-125 ${star <= (hoverRating || rating)
                    ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                    : 'text-gray-300'
                    }`}
                  onClick={() => setRating(star as Rating)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${star} estrellas`}
                >
                  ★
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-500 font-medium ml-2">
                  ({rating} estrella{rating !== 1 ? 's' : ''})
                </span>
              )}
            </div>
          </div>

          {/* Campo de comentario */}
          <div className="mb-6">
            <label htmlFor="comentario" className="block text-sm font-semibold text-gray-700 font-poppins mb-2.5">
              Comentario <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="comentario"
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-sm text-gray-900 font-sans resize-y leading-relaxed focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all duration-200"
              rows={5}
              placeholder="Comparte tu experiencia con este producto..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-400 mt-1.5">
              {comentario.length}/500 caracteres
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-5 flex items-center animate-shake">
              {error}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold font-poppins rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#3B001E] text-white font-semibold font-poppins rounded-lg shadow-md hover:bg-[#92400e] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Publicar reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}