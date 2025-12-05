// src/admin/components/dashboard/InventoryAlerts.tsx
import type { InventoryAlert } from '../../types/dashboard';

interface InventoryAlertsProps {
  inventoryAlerts: InventoryAlert[];
  onRestock: (productId: number) => void;
}

export default function InventoryAlerts({ inventoryAlerts, onRestock }: InventoryAlertsProps) {
  const criticalStock = inventoryAlerts.filter(a => a.status === 'critical');
  const lowStock = inventoryAlerts.filter(a => a.status === 'low');

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
        Alertas de Inventario
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Stock Crítico */}
        {criticalStock.length > 0 && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#111827',
                margin: 0
              }}>
                Stock Crítico
              </h4>
              <button 
                onClick={() => criticalStock.forEach(item => onRestock(item.id))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Restablecer
              </button>
            </div>
            <div style={{ 
              padding: '12px',
              background: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fecaca'
            }}>
              {criticalStock.map(item => (
                <div key={item.id} style={{ color: '#dc2626', fontSize: '14px' }}>
                  {item.name} - Solo quedan {item.stock} unidades
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stock Bajo */}
        {lowStock.length > 0 && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#111827',
                margin: 0
              }}>
                Stock bajo
              </h4>
              <button style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#374151',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Ver Detalles
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lowStock.map(item => (
                <div key={item.id} style={{
                  padding: '12px',
                  background: '#fffbeb',
                  borderRadius: '8px',
                  border: '1px solid #fed7aa'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{ color: '#92400e', fontSize: '14px', fontWeight: '500' }}>
                      {item.name}
                    </span>
                    <span style={{ 
                      padding: '4px 8px',
                      background: '#fef3c7',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#92400e'
                    }}>
                      Stock bajo
                    </span>
                  </div>
                  <div style={{ color: '#92400e', fontSize: '13px' }}>
                    {item.stock} unidades restantes
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {inventoryAlerts.length === 0 && (
          <div style={{ 
            padding: '40px 20px', 
            textAlign: 'center', 
            color: '#6b7280',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            No hay alertas de inventario
          </div>
        )}
      </div>
    </div>
  );
}