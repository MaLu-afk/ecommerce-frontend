// src/components/recommendations/UserRecommendations.tsx
import { useRecommendations } from '../../hooks/useRecommendations';
import { ProductsCarousel } from '../common/ProductsCarousel';

interface UserRecommendationsProps {
  title?: string;
  topN?: number;
}

export function UserRecommendations({
  title = "Basado en tu historial",
  topN = 4
}: UserRecommendationsProps) {
  const { data, loading, error, refetch } = useRecommendations({
    type: 'user',
    topN,
    enabled: true
  });

  // Loading state
  if (loading) {
    return (
      <div className="max-w-[1390px] mx-auto p-5">
        <h3 className="font-poppins text-2xl font-semibold text-black mb-4">{title}</h3>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Cargando recomendaciones...</span>
        </div>
      </div>
    );
  }

  // Error state con opción de reintentar
  if (error) {
    return (
      <div className="max-w-[1390px] mx-auto p-5">
        <h3 className="font-poppins text-2xl font-semibold text-black mb-4">{title}</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 mb-3">
            No pudimos cargar tus recomendaciones personalizadas.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data?.productos.length) return null;

  return <ProductsCarousel products={data.productos} title={title} showScores={false} algorithm={data.algoritmo} />;
}