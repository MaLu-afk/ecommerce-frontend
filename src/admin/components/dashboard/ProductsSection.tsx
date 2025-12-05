// src/admin/components/dashboard/ProductsSection.tsx
import type { TopProduct, TopSearchedProduct } from '../../types/dashboard';

interface ProductsSectionProps {
  topProducts?: TopProduct[];
  topSearchedProducts?: TopSearchedProduct[];
}

const getMaxSearches = (products: TopSearchedProduct[] = []): number => {
  if (!products.length) return 1;        // evita Math.max() con array vacío
  return Math.max(...products.map(p => p.searches));
};

const EmptyState = ({ message }: { message: string }) => (
  <div
    style={{
      padding: '40px 20px',
      textAlign: 'center',
      color: '#6b7280',
      background: '#f9fafb',
      borderRadius: '8px',
    }}
  >
    {message}
  </div>
);

export default function ProductsSection({
  topProducts = [],
  topSearchedProducts = [],
}: ProductsSectionProps) {
  const maxSearches = getMaxSearches(topSearchedProducts);

  return (
    <>
      {/* Top 5 Productos Más Vendidos */}
      <div
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '20px',
            fontFamily: 'Poppins',
          }}
        >
          Top 5 productos más vendidos
        </h3>
        {topProducts.length === 0 ? (
          <EmptyState message="No hay productos vendidos para mostrar" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topProducts.map((product) => (
              <div key={product.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontWeight: '500',
                      color: '#111827',
                      fontSize: '14px',
                    }}
                  >
                    {product.name}
                  </span>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: '#111827',
                      fontSize: '16px',
                    }}
                  >
                    {product.sales} ventas
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#6b7280',
                  }}
                >
                  Categoría {product.category} | Stock {product.stock} unidades
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top 5 Productos Más Buscados */}
      <div
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '20px',
            fontFamily: 'Poppins',
          }}
        >
          Top 5 productos más buscados
        </h3>
        {topSearchedProducts.length === 0 ? (
          <EmptyState message="No hay datos de búsquedas para mostrar" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topSearchedProducts.map((product) => {
              const percentage = (product.searches / maxSearches) * 100;

              return (
                <div key={product.id}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: '500',
                        color: '#111827',
                        fontSize: '14px',
                      }}
                    >
                      {product.name}
                    </span>
                    <span
                      style={{
                        fontWeight: 'bold',
                        color: '#111827',
                        fontSize: '14px',
                      }}
                    >
                      {product.searches} búsquedas
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: '#3b82f6',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {/* Escala */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '8px',
                fontSize: '12px',
                color: '#6b7280',
              }}
            >
              <span>0</span>
              <span>{Math.round(maxSearches * 0.25)}</span>
              <span>{Math.round(maxSearches * 0.5)}</span>
              <span>{Math.round(maxSearches * 0.75)}</span>
              <span>{maxSearches}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
