// src/components/details/RatingBars.tsx
import type { RatingDistribution } from "../../types/productDetail";

interface RatingBarsProps {
  distribution: RatingDistribution;
}

/**
 * Muestra barras visuales con la distribución de calificaciones (1-5 estrellas)
 */
export default function RatingBars({ distribution }: RatingBarsProps) {
  const totalReviews = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-[400px]">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[String(rating) as keyof RatingDistribution];
        const percentage = getPercentage(count);

        return (
          <div key={rating} className="flex items-center gap-2 text-sm">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-6 text-right font-medium text-base text-gray-800">
              {rating}
            </span>
            <span className="text-xl text-yellow-400">★</span>
          </div>
        );
      })}
    </div>
  );
}