// src/admin/components/dashboard/CategoriesSection.tsx
import type { TopCategory } from '../../types/dashboard';

interface CategoriesSectionProps {
  topCategories: TopCategory[];
}

export default function CategoriesSection({ topCategories }: CategoriesSectionProps) {
  if (topCategories.length === 0) {
    return (
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#111827', 
          marginBottom: '20px',
          fontFamily: 'Poppins'
        }}>
          Top 5 categorías más buscadas
        </h3>
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          color: '#6b7280',
          background: '#f9fafb',
          borderRadius: '8px'
        }}>
          No hay categorías para mostrar
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        color: '#111827', 
        marginBottom: '20px',
        fontFamily: 'Poppins'
      }}>
        Top 5 categorías más buscadas
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {topCategories.map((category) => (
          <div key={category.id}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px'
            }}>
              <span style={{ fontWeight: '500', color: '#111827', fontSize: '14px' }}>
                {category.name}
              </span>
              <span style={{ fontWeight: 'bold', color: '#111827', fontSize: '16px' }}>
                {category.searches} búsquedas
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              Stock {category.stock} unidades
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}