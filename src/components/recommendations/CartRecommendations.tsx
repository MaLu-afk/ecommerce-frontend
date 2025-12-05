// src/components/recommendations/CartRecommendations.tsx
import { useCart } from '../../hooks/useCart';
import { useRecommendations } from '../../hooks/useRecommendations';
import { ProductsCarousel } from '../common/ProductsCarousel';

export function CartRecommendations() {
  const { cartItems } = useCart();

  // Seleccionar el producto más caro del carrito (más relevante)
  const getMostExpensiveProduct = () => {
    if (!cartItems.length) return null;
    return cartItems.reduce((max, item) =>
      item.product.precio > max.product.precio ? item : max
    );
  };

  const relevantProduct = getMostExpensiveProduct();
  const productId = relevantProduct?.product?.id;

  const { data, loading, error, refetch } = useRecommendations({
    type: 'product',
    productId,
    topN: 4,
    enabled: !!productId && cartItems.length > 0
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Cargando sugerencias...</span>
      </div>
    );
  }

  // Error state con opción de reintentar
  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center my-4">
        <p className="text-yellow-800 mb-3">
          No pudimos cargar las sugerencias en este momento.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // No data state
  if (!data?.productos.length) return null;

  return (
    <div className="mt-8">
      <ProductsCarousel
        products={data.productos}
        title="Completa tu compra"
        showScores={false}
        algorithm={data.algoritmo}
      />
    </div>
  );
}