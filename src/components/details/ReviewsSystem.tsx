// src/components/reviews/ReviewsSystem.tsx
import { useState } from "react";
import RatingBars from "../details/RatingBars";
import AddReviewModal from "../details/AddReviewModal";
import type { Review, RatingDistribution } from "../../types/productDetail";
import { useAuth } from "../../hooks/useAuth";

interface ReviewsSystemProps {
    productId: number;
    initialReviews: Review[];
    initialReviewCount: number;
    initialRatingAverage: number;
    initialRatingDistribution: RatingDistribution;
    onReviewSubmit?: (review: Review) => void;
}

/**
 * Componente independiente para el sistema de reseñas
 * Puede ser importado y usado en cualquier página de producto
 */
export default function ReviewsSystem({
    productId,
    initialReviews,
    initialReviewCount,
    initialRatingAverage,
    initialRatingDistribution,
    onReviewSubmit
}: ReviewsSystemProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [reviewCount, setReviewCount] = useState(initialReviewCount);
    const [ratingAverage, setRatingAverage] = useState(initialRatingAverage);
    const [ratingDistribution, setRatingDistribution] = useState(initialRatingDistribution);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();

    const currentUser = isAuthenticated && user ? {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido
    } : null;

    const calculateNewAverage = (currentAvg: number, currentCount: number, newRating: number): number => {
        const totalSum = currentAvg * currentCount;
        const newSum = totalSum + newRating;
        const newCount = currentCount + 1;
        return newSum / newCount;
    };

    const handleReviewSubmit = (newReview: Review) => {
        const completeReview: Review = {
            ...newReview,
            usuario_nombre: `${currentUser?.nombre} ${currentUser?.apellido}`,
            fecha: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        setReviews(prev => [completeReview, ...prev]);
        const newCount = reviewCount + 1;
        setReviewCount(newCount);
        const newAverage = calculateNewAverage(ratingAverage, reviewCount, newReview.rating);
        setRatingAverage(newAverage);

        setRatingDistribution(prev => ({
            ...prev,
            [String(newReview.rating)]: prev[String(newReview.rating) as keyof typeof prev] + 1
        }));

        if (onReviewSubmit) {
            onReviewSubmit(completeReview);
        }

        setIsModalOpen(false);
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <span
                    key={i}
                    className="text-5xl text-yellow-400 transition-transform duration-200 hover:scale-125 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                >
                    ★
                </span>
            );
        }

        if (hasHalfStar) {
            stars.push(
                <span key="half" className="relative text-5xl">
                    <span className="text-gray-300">★</span>
                    <span className="absolute left-0 top-0 w-1/2 overflow-hidden text-yellow-400">★</span>
                </span>
            );
        }

        for (let i = 0; i < 5 - Math.ceil(rating); i++) {
            stars.push(
                <span
                    key={`empty-${i}`}
                    className="text-5xl text-gray-300 transition-transform duration-200 hover:scale-125"
                >
                    ☆
                </span>
            );
        }

        return stars;
    };

    const handleAddReviewClick = () => {
        if (!isAuthenticated) return;
        setIsModalOpen(true);
    };

    return (
        <div className="w-full mt-10">
            <div className="bg-white p-6">
                <h3 className="font-poppins text-2xl font-semibold text-black mb-4">
                    Comentarios sobre el producto
                </h3>

                <div className="flex flex-col lg:flex-row gap-10 mt-5">
                    {/* Resumen de calificaciones */}
                    <div className="lg:w-[600px]">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex gap-1">
                                {renderStars(ratingAverage)}
                            </div>
                            <span className="text-5xl font-semibold text-orange-600">
                                {ratingAverage.toFixed(1)}
                            </span>
                        </div>

                        <span className="ml-2.5 text-gray-500 text-xl">
                            ({reviewCount} calificaciones)
                        </span>

                        <div className="mt-6">
                            <RatingBars distribution={ratingDistribution} />
                        </div>
                    </div>

                    {/* Lista de reseñas */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-5 mb-6">
                            <h4 className="text-xl font-semibold">Reseñas de clientes</h4>
                            <button
                                className="px-5 py-2.5 bg-[#3B001E] text-white font-semibold font-poppins rounded-lg shadow-md hover:bg-[#92400e] hover:shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={handleAddReviewClick}
                                disabled={!isAuthenticated}
                                title={!isAuthenticated ? 'Debes iniciar sesión para agregar un comentario' : 'Agregar un nuevo comentario'}
                            >
                                Agregar comentario
                            </button>
                        </div>

                        {reviews.length > 0 && (
                            <div className="flex flex-col gap-5">
                                {reviews.slice(0, 3).map((review) => (
                                    <div
                                        key={review.id}
                                        className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
                                            <div className="flex-1">
                                                <span className="font-semibold text-gray-900 text-base block mb-2">
                                                    {review.usuario_nombre}
                                                </span>
                                                <p className="text-gray-700 text-sm leading-relaxed m-0">
                                                    {review.comentario}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 items-start lg:items-end">
                                                <div className="flex gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`text-2xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        >
                                                            {i < review.rating ? '★' : '☆'}
                                                        </span>
                                                    ))}
                                                </div>

                                                <span className="text-gray-500 text-sm">
                                                    {new Date(review.fecha).toLocaleDateString('es-ES', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de agregar reseña */}
            {isModalOpen && currentUser && (
                <AddReviewModal
                    onClose={() => setIsModalOpen(false)}
                    productId={productId}
                    userId={currentUser.id}
                    onSubmit={handleReviewSubmit}
                />
            )}
        </div>
    );
}