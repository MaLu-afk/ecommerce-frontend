import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductDetail from "../components/details/description";
import { getProductDetails } from "../api/productDetails";
import type { ProductData, Review } from "../types/productDetail";
import { ProductRecommendations } from '../components/recommendations/ProductRecommendations';
import ReviewsSystem from "../components/details/ReviewsSystem";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleReviewSubmit = (review: Review) => {
    console.log('Nueva reseña agregada:', review);
  };

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    getProductDetails(Number(id))
      .then(setProduct)
      .catch((err) => {
        console.error('Error al cargar producto:', err);
        setError('Error al cargar el producto');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-xl">Producto no encontrado</p>
          <a
            href="/"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Componente de detalle del producto existente */}
      <ProductDetail product={product} />

      {/* Sistema de reseñas */}
      <ReviewsSystem
        productId={product.id}
        initialReviews={product.resenas || []}
        initialReviewCount={product.recuento_resenas || 0}
        initialRatingAverage={product.rating_promedio || 0}
        initialRatingDistribution={product.rating_distribucion || {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0
        }}
        onReviewSubmit={handleReviewSubmit}
      />

      {/* Sección de recomendaciones - se muestra solo si hay producto */}
      <div className="recommendations-section">
        <ProductRecommendations
          productId={product.id}
          topN={6}
        />
      </div>

    </div>
  );
}